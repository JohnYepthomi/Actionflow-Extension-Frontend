import { createMachine, assign } from "xstate";
import { ActionNodeProps } from "../ActionsDefinitions/definitions.jsx";
import { InteractionDefintions } from "../ActionsDefinitions/definitions";
const commonEvents = {
    INTERACTION: {
        actions: ["newAction", "saveToStorage"],
    },
    CONDITIONALS: {
        actions: ["newAction", "saveToStorage"],
    },
    ADD_CONDITION_OPERATOR: {
        actions: ["newOperator"],
    },
    UPDATE_CONDITION: {
        actions: ["newCondition", "saveToStorage"],
    },
    TAB_ACTIONS_UPDATE: {
        actions: ["updateTab", "saveToStorage"],
    },
    UPDATE_ACTIVE_TAB: {
        actions: ["activeTab"],
    },
    DRAG_EVENT: {
        actions: ["handleActionSort", "resolveNesting", "saveToStorage"]
    }
};
export const AppStateMachine = createMachine({
    predictableActionArguments: true,
    id: "Actionflow",
    initial: "idle",
    context: {
        flowActions: [],
        activeTab: null,
    },
    states: {
        processing: {
            on: commonEvents,
        },
        idle: {
            on: {
                ...commonEvents,
                START_RECORD: {
                    target: "#Actionflow.recording",
                },
                RESTORE_ACTIONS: {
                    target: "idle",
                    actions: ["restore"],
                },
            },
        },
        recording: {
            on: {
                ...commonEvents,
                RECORDED_INTERACTION: {
                    actions: ["recordedAction", "saveToStorage"],
                },
                RECORDED_TAB_ACTION: {
                    actions: ["recordedAction", "saveToStorage"],
                },
                STOP_RECORD: {
                    target: "#Actionflow.idle",
                },
                ERROR: "handleError",
                UPDATE_RECORDED_ACTION: {
                    actions: ["recordedAction", "saveToStorage"],
                },
            },
        },
        handleError: {
            invoke: {
                id: "handle-error",
                src: (_context, event) => {
                    return new Promise((res, rej) => {
                        try {
                            handleErrors(event.data);
                            res("done");
                        }
                        catch (err) {
                            rej(err);
                        }
                    });
                },
                onDone: "idle",
                onError: "error",
            },
        },
        error: {},
    },
}, {
    actions: {
        newAction: assign({ flowActions: createAction }),
        newOperator: assign({ flowActions: addConditionOperator }),
        newCondition: assign({ flowActions: updateCondition }),
        restore: assign({ flowActions: restoreFlowActions }),
        activeTab: assign({ activeTab: updateActiveTab }),
        recordedAction: assign({ flowActions: actionFromRecording }),
        saveToStorage: saveToStorage,
        handleActionSort: assign({ flowActions: itemReposition }),
        resolveNesting: assign({ flowActions: evauateNesting }),
        updateTab: assign({ flowActions: updateTabAction }),
    },
});
function updateTabAction(context, event) {
    return context.flowActions.map(act => {
        if (act.id === event.updated_action.id)
            return event.updated_action;
        else
            return act;
    });
}
function actionFromRecording(context, event) {
    console.log("actionFromRecording");
    const actionType = event.actionType;
    let currentAction = null;
    if (["Click", "Type", "Keypress", "Select", "Hover", "Prompts"].includes(actionType))
        currentAction = "INT_ACTION";
    if (["SelectTab", "SelectWindow", "Navigate", "NewTab", "NewWindow", "CloseTab", "CloseWindow", "Back", "Forward"].includes(actionType))
        currentAction = "TAB_ACTION";
    switch (currentAction) {
        case "INT_ACTION":
            const int_action = event.payload;
            int_action["recorded"] = true;
            int_action["id"] = guidGenerator();
            int_action["svg"] = InteractionDefintions.filter((idata) => idata.name.toLowerCase() === int_action.actionType.toLowerCase())[0].svg;
            int_action["nestingLevel"] = 0;
            return [...context.flowActions, int_action];
            break;
        case "TAB_ACTION":
            const { url, tabId, windowId } = event.payload;
            const prevActions = context.flowActions;
            const prevNewTabAction = prevActions[prevActions.length - 1];
            const isLastNewTabAction = prevActions.length > 0 && prevNewTabAction.actionType === "NewTab" && prevNewTabAction.url === "chrome://new-tab-page/";
            const isNavigate = actionType === "Navigate";
            if (isLastNewTabAction && isNavigate) {
                prevNewTabAction.url = url;
                return [...prevActions.filter(ac => ac.id !== prevNewTabAction.id), prevNewTabAction];
            }
            const tab_action = {};
            tab_action["id"] = guidGenerator();
            tab_action["actionType"] = event.actionType;
            tab_action["nestingLevel"] = 0;
            tab_action["url"] = url;
            tab_action["svg"] = InteractionDefintions.filter((idata) => idata.name.toLowerCase() === "keypress")[0].svg;
            tab_action["tabId"] = tabId;
            tab_action["windowId"] = windowId;
            return [...context.flowActions, tab_action];
            break;
        default:
            return context.flowActions;
            break;
    }
}
function saveToStorage(context) {
    const { flowActions } = context;
    const storageKey = "composeData";
    const stringified = JSON.stringify(flowActions);
    localStorage.setItem(storageKey, stringified);
    console.log(stringified);
}
function guidGenerator() {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4());
}
function updateActiveTab(_context, event) {
    console.log("updateActiveTab");
    return event.newTabInfo;
}
function createAction(context, event) {
    console.log("createAction");
    const ACTION_EVENT_TYPE = event.type;
    let tempState = [];
    const { name, svg } = event.item;
    switch (ACTION_EVENT_TYPE) {
        case "INTERACTION":
            const props = {
                ...ActionNodeProps["Common"],
                ...ActionNodeProps[`${name}`],
            };
            const newInteractionAction = {
                id: guidGenerator(),
                svg: svg,
                actionType: name,
                recorded: false,
                props,
                nestingLevel: 0,
            };
            tempState.push(newInteractionAction);
            break;
        case "CONDITIONALS":
            const GeneralConditionDefaultTemplate = {
                selectedType: "Element",
                selectedOption: "IsVisible",
                requiresCheck: true,
                checkValue: "",
            };
            const newConditionAction = {
                id: guidGenerator(),
                svg: svg,
                actionType: name,
                nestingLevel: 0,
                conditions: [GeneralConditionDefaultTemplate],
            };
            tempState.push(newConditionAction);
            break;
        default:
            break;
    }
    return [...context.flowActions, ...tempState];
}
function addConditionOperator(context, event) {
    console.log("addConditionOperator");
    const actionId = event.actionId;
    const selectedOperator = event.selection;
    const GeneralConditionDefaultTemplate = {
        selectedType: "Element",
        selectedOption: "IsVisible",
        requiresCheck: true,
        checkValue: "",
    };
    const prevConditions = context.flowActions.filter(({ id }) => id === actionId)[0]["conditions"];
    const updatedConditions = [
        ...prevConditions,
        { type: "Operator", selected: selectedOperator },
        GeneralConditionDefaultTemplate,
    ];
    return [
        ...context.flowActions.map((action) => {
            if (action.id === event.actionId) {
                return { ...action, conditions: updatedConditions };
            }
            return action;
        }),
    ];
}
function updateCondition(context, event) {
    console.log("updateCondition");
    const { index, actionId, selection, } = event;
    return context.flowActions.map((action) => {
        if (action.id === actionId) {
            const updatedCond = action["conditions"].map((cond, idx) => {
                if (idx === index) {
                    if (selection) {
                        cond["selectedType"] = selection.conditionType;
                        cond["selectedOption"] = selection.selectedOption;
                        cond["requiresCheck"] = selection.requiresCheck;
                    }
                    else if (selection.requiresCheck && selection.value) {
                        cond["checkValue"] = selection.value;
                    }
                }
                return cond;
            });
            return { ...action, conditions: updatedCond };
        }
        return action;
    });
}
function handleErrors(error) {
    console.log(error);
}
function restoreFlowActions(context, event) {
    console.log("restoreFlowActions");
    const storageKey = "composeData";
    const prevActions = localStorage.getItem(storageKey);
    return prevActions ? JSON.parse(prevActions) : [];
}
function itemReposition(context, event) {
    console.log("itemReposition");
    const { updatedActions } = event;
    return updatedActions;
}
function evauateNesting(context, event) {
    const t0 = performance.now();
    console.log("evauateNesting() called. event: ", event);
    const { initialDraggedPos, currentDraggedPos } = event.dragInfo;
    if (initialDraggedPos === currentDraggedPos)
        return context.flowActions;
    let nestingLevel = 0;
    let prevAction = null;
    let PrevIfCount = 0;
    let marginLeft = 0;
    const newActions = context.flowActions.map((action) => {
        if (prevAction?.actionType === "IF") {
            PrevIfCount++;
            nestingLevel++;
            marginLeft += 20;
        }
        if (PrevIfCount > 0 && action.actionType === "END") {
            PrevIfCount--;
            nestingLevel--;
            marginLeft -= 20;
        }
        const updatedAction = {
            ...action,
            nestingLevel: nestingLevel,
            marginLeft: marginLeft
        };
        prevAction = action;
        return updatedAction;
    });
    const t1 = performance.now();
    console.log(`EvauateNesting took ${t1 - t0} milliseconds.`);
    return newActions;
}

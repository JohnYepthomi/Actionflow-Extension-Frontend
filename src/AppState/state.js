import { createMachine, assign } from "xstate";
import { ActionNodeProps } from "../ActionsDefinitions/definitions.jsx";
import { InteractionDefintions } from "../ActionsDefinitions/definitions";
export const AppStateMachine = createMachine({
    predictableActionArguments: true,
    id: "Actionflow",
    initial: "idle",
    context: {
        flowActions: [],
        activeTab: null,
    },
    states: {
        idle: {
            on: {
                INTERACTION: {
                    target: "idle",
                    actions: ["newAction"],
                },
                CONDITIONALS: {
                    target: "idle",
                    actions: ["newAction"],
                },
                ADD_CONDITION_OPERATOR: {
                    target: "idle",
                    actions: ["newOperator"],
                },
                UPDATE_CONDITION: {
                    target: "idle",
                    actions: ["newCondition"],
                },
                SAVE_ACTIONS: {
                    target: "idle",
                    actions: saveToStorage,
                },
                UPDATE_ACTIVE_TAB: {
                    target: "idle",
                    actions: ["activeTab"],
                },
                RESTORE_ACTIONS: {
                    target: "idle",
                    actions: ["restore"],
                },
                START_RECORD: "recording",
            },
        },
        recording: {
            on: {
                INTERACTION: {
                    target: "recording",
                    actions: ["newAction"],
                },
                CONDITIONALS: {
                    target: "recording",
                    actions: ["newAction"],
                },
                ADD_CONDITION_OPERATOR: {
                    target: "recording",
                    actions: ["newOperator"],
                },
                UPDATE_CONDITION: {
                    target: "recording",
                    actions: ["newCondition"],
                },
                SAVE_ACTIONS: {
                    target: "recording",
                    actions: saveToStorage,
                },
                UPDATE_ACTIVE_TAB: {
                    target: "recording",
                    actions: ["activeTab"],
                },
                STOP_RECORD: "idle",
                UPDATE_RECORDED_ACTION: {
                    target: "recording",
                    actions: ["recordedAction"],
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
        recordedAction: assign({
            flowActions: actionFromRecording,
        }),
    },
});
function actionFromRecording(context, event) {
    const newRecordedAction = event.newRecordedAction;
    newRecordedAction["recorded"] = true;
    newRecordedAction["id"] = guidGenerator();
    newRecordedAction["svg"] = InteractionDefintions.filter((idata) => idata.name.toLowerCase() === newRecordedAction.event.toLowerCase())[0].svg;
    return [...context.flowActions, newRecordedAction];
}
function saveToStorage(context) {
    const { flowActions } = context;
    localStorage.setItem("composeData", JSON.stringify(flowActions));
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
    return event.newTabInfo;
}
function createAction(context, event) {
    const EVENT_TYPE = event.type;
    const { name, svg } = event.item;
    let tempState = [];
    switch (EVENT_TYPE) {
        case "INTERACTION":
            const props = {
                ...ActionNodeProps["Common"],
                ...ActionNodeProps[`${name}`],
            };
            const newInteractionAction = {
                id: guidGenerator(),
                event: name,
                svg: svg,
                actionType: event.type,
                props,
            };
            tempState.push(newInteractionAction);
            break;
        case "CONDITIONALS":
            const defaultCondition = {
                selectedType: "Element",
                selectedOption: "IsVisible",
                requiresCheck: true,
                checkValue: null,
            };
            const newConditionAction = {
                id: guidGenerator(),
                event: name,
                svg: svg,
                actionType: event.type,
                conditions: [defaultCondition],
            };
            tempState.push(newConditionAction);
            break;
        default:
            break;
    }
    return [...context.flowActions, ...tempState];
}
function addConditionOperator(context, event) {
    return [
        ...context.flowActions.map((action) => {
            if (action.id === event.actionId) {
                return { ...action, conditions: event.updatedConditions };
            }
            return action;
        }),
    ];
}
function updateCondition(context, event) {
    const { index, actionId, selection, checkValue, } = event;
    return context.flowActions.map((action) => {
        if (action.id === actionId) {
            const updatedCond = action["conditions"].map((cond, idx) => {
                if (idx === index && cond.type !== "Operator") {
                    if (selection) {
                        cond["selectedOption"] = selection.value;
                        cond["selectedType"] = selection.conditionType;
                        cond["requiresCheck"] = selection.requiresCheck;
                    }
                    else if (checkValue) {
                        cond["checkValue"] = checkValue;
                    }
                }
                return cond;
            });
            return { ...action, conditions: updatedCond };
        }
        else
            return action;
    });
}
function handleErrors(error) {
    console.log(error);
}
function restoreFlowActions(context, event) {
    const prevActions = localStorage.getItem("composeData");
    return prevActions ? JSON.parse(prevActions) : [];
}

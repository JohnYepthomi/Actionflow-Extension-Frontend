import { createMachine, assign } from "xstate";
import { ActionNodeProps } from "../ActionsDefinitions/definitions.jsx";
function saveToStorage(context, event) {
    const { flowActions } = context;
    return new Promise((resolve) => {
        localStorage.setItem("composeData", JSON.stringify(flowActions));
        resolve("success");
    });
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
function createAction(context, event) {
    const { item } = event;
    let tempState = [];
    if (event.type === "INTERACTION") {
        const props = {
            Common: ActionNodeProps["Common"],
            [`${item.name}`]: ActionNodeProps[`${item.name}`],
        };
        tempState.push({
            id: guidGenerator(),
            name: item.name,
            svg: item.svg,
            actionType: event.type,
            props,
        });
    }
    else if (event.type === "CONDITIONALS") {
        const defaultConditionOption = {
            selectedType: "Element",
            selectedOption: "IsVisible",
            requiresCheck: true,
            checkValue: null,
        };
        tempState.push({
            id: guidGenerator(),
            name: item.name,
            svg: item.svg,
            actionType: event.type,
            conditions: [defaultConditionOption],
        });
    }
    return new Promise((resolve) => {
        resolve(tempState);
    });
}
function updateCondition(context, event) { }
function handleErrors(error) {
    console.log(error);
}
function restoreFlowActions() {
    return new Promise((resolve) => {
        const prevActions = localStorage.getItem("composeData");
        resolve(prevActions ? JSON.parse(prevActions) : []);
    });
}
export const AppStateMachine = createMachine({
    predictableActionArguments: true,
    id: "Actionflow",
    initial: "idle",
    context: {
        flowActions: [],
    },
    states: {
        idle: {},
        createAction: {
            invoke: {
                id: "create-action",
                src: createAction,
                onDone: {
                    target: "idle",
                    actions: assign({
                        flowActions: (context, event) => [
                            ...context.flowActions,
                            ...event.data,
                        ],
                    }),
                },
                onError: "error",
            },
        },
        save: {
            invoke: {
                id: "saving-to-storage",
                src: saveToStorage,
                onDone: "idle",
                onError: "handleError",
            },
        },
        restoreActions: {
            invoke: {
                id: "restore-actions",
                src: restoreFlowActions,
                onDone: {
                    target: "idle",
                    actions: assign({
                        flowActions: (context, event) => [
                            ...context.flowActions,
                            event.data,
                        ],
                    }),
                },
                onError: "handleError",
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
    on: {
        INTERACTION: ".createAction",
        CONDITIONALS: ".createAction",
        ADD_CONDITION_OPERATOR: {
            target: ".idle",
            actions: assign({
                flowActions: (context, event) => [
                    ...context.flowActions.map((action) => {
                        if (action.id === event.actionId) {
                            return { ...action, conditions: event.updatedConditions };
                        }
                        return action;
                    }),
                ],
            }),
        },
        UPDATE_CONDITION: {
            target: "idle",
            actions: assign({
                flowActions: (context, event) => {
                    return context.flowActions.map((action) => {
                        if (action.id === event.actionId) {
                            const updatedCond = action["conditions"].map((cond, idx) => {
                                if (idx === event.index && cond.type !== "Operator") {
                                    if (event.selection) {
                                        cond["selectedOption"] = event.selection.value;
                                        cond["selectedType"] = event.selection.conditionType;
                                        cond["requiresCheck"] = event.selection.requiresCheck;
                                    }
                                    else if (event.checkValue) {
                                        cond["checkValue"] = event.checkValue;
                                    }
                                    return cond;
                                }
                                else
                                    return cond;
                            });
                            return { ...action, conditions: updatedCond };
                        }
                        else
                            return action;
                    });
                },
            }),
        },
        RESTORE: ".restoreActions",
    },
});

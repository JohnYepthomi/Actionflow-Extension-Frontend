import { createMachine, assign } from "xstate";
import {
  TAction,
  TActionTypes,
  TCondition,
  TInteractionItemPayload,
  TUpdateConditionEventPayload,
  TLocalStorageKey,
} from "./types";
import { ActionNodeProps } from "../ActionsDefinitions/definitions.jsx";
import { InteractionDefintions } from "../ActionsDefinitions/definitions";

interface FlowContext {
  flowActions: TAction[];
  activeTab: string;
}

export const AppStateMachine = createMachine<FlowContext>(
  {
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
              } catch (err) {
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
  },
  {
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
  }
);

function actionFromRecording(context: FlowContext, event: any) {
  const newRecordedAction = event.newRecordedAction;

  // add a marker to indicate recorded action for UI
  newRecordedAction["recorded"] = true;

  // Give it an ID
  newRecordedAction["id"] = guidGenerator();

  // Append Action Icon
  newRecordedAction["svg"] = InteractionDefintions.filter(
    (idata) =>
      idata.name.toLowerCase() === newRecordedAction.event.toLowerCase()
  )[0].svg;

  return [...context.flowActions, newRecordedAction as TAction];
}

function saveToStorage(context: FlowContext) {
  const { flowActions } = context;
  const storageKey: TLocalStorageKey = "ComposeData";
  localStorage.setItem(storageKey, JSON.stringify(flowActions));
}

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
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
    S4()
  );
}

function updateActiveTab(_context: FlowContext, event: any) {
  return event.newTabInfo;
}

function createAction(context: FlowContext, event: any) {
  const ACTION_EVENT_TYPE: TActionTypes = event.type;
  const { name, svg }: TInteractionItemPayload = event.item;
  let tempState: TAction[] = [];

  switch (ACTION_EVENT_TYPE) {
    case "INTERACTION":
      const props = {
        ...ActionNodeProps["Common"],
        ...ActionNodeProps[`${name}`],
      };
      const newInteractionAction: TAction = {
        id: guidGenerator(),
        event: name,
        svg: svg,
        actionType: event.type,
        props,
      };

      tempState.push(newInteractionAction);
      break;

    case "CONDITIONALS":
      const defaultCondition: TCondition = {
        selectedType: "Element",
        selectedOption: "IsVisible",
        requiresCheck: true,
        checkValue: null,
      };
      const newConditionAction: TAction = {
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

function addConditionOperator(context: FlowContext, event: any) {
  return [
    ...context.flowActions.map((action) => {
      if (action.id === event.actionId) {
        return { ...action, conditions: event.updatedConditions };
      }
      return action;
    }),
  ];
}

function updateCondition(context: FlowContext, event: any) {
  const {
    index,
    actionId,
    selection,
    checkValue,
  }: TUpdateConditionEventPayload = event;

  return context.flowActions.map((action) => {
    if (action.id === actionId) {
      const updatedCond = action["conditions"].map((cond: any, idx: number) => {
        if (idx === index && cond.type !== "Operator") {
          if (selection) {
            cond["selectedOption"] = selection.value;
            cond["selectedType"] = selection.conditionType;
            cond["requiresCheck"] = selection.requiresCheck;
          } else if (checkValue) {
            cond["checkValue"] = checkValue;
          }
        }
        return cond;
      });
      return { ...action, conditions: updatedCond };
    }

    return action;
  });
}

function handleErrors(error: any) {
  console.log(error);
}

function restoreFlowActions(context: FlowContext, event: any) {
  const storageKey: TLocalStorageKey = "ComposeData";
  const prevActions = localStorage.getItem(storageKey);
  return prevActions ? JSON.parse(prevActions) : [];
}

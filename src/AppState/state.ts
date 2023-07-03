import { createMachine, assign } from "xstate";
import {
  TAction,
  IntAction,
  TabAction,
  CondAction,
  SelectableConditions,
  GeneralCondition,
  TInteractionPayload,
  TConditionalPayload,
  TConditionalUpdatePayload,
  ActionEventTypes,
  CondEventTypes,
  CondEndEventTypes,
  TLocalStorageKey,
} from "./types";
import { ActionNodeProps } from "../ActionsDefinitions/definitions.jsx";
import { InteractionDefintions } from "../ActionsDefinitions/definitions";
import GlobeIcon from "../assets/globe";

interface FlowContext {
  flowActions: TAction[];
  activeTab: string;
}

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
    actions: [ "handleActionSort", "resolveNesting", "saveToStorage"]
  }
};

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
          RECORDED_INTERACTION : {
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
      recordedAction: assign({ flowActions: actionFromRecording }),
      saveToStorage: saveToStorage,
      handleActionSort:  assign({ flowActions: itemReposition }),
      resolveNesting: assign({flowActions: evauateNesting}),
      updateTab: assign({flowActions: updateTabAction}),
    },
  }
);

function updateTabAction(context: FlowContext, event: any){
  return context.flowActions.map( act => {
    if(act.id === event.updated_action.id)
      return event.updated_action;
    else return act;
  });
}

function actionFromRecording(context: FlowContext, event: any) {
  console.log("actionFromRecording");
  const actionType = event.actionType;
  let currentAction = null;

  if(["Click", "Type", "Keypress", "Select", "Hover", "Prompts"].includes(actionType))
    currentAction = "INT_ACTION";
  if(["SelectTab", "SelectWindow", "Navigate", "NewTab", "NewWindow", "CloseTab", "CloseWindow", "Back", "Forward"].includes(actionType))
    currentAction = "TAB_ACTION";

  switch (currentAction) {
    case "INT_ACTION":
      const int_action = event.payload;
      int_action["recorded"] = true;
      int_action["id"] = guidGenerator();
      int_action["svg"] = InteractionDefintions.filter(
        (idata) =>
          idata.name.toLowerCase() === int_action.actionType.toLowerCase()
      )[0].svg;
      int_action["nestingLevel"] = 0;
      return [...context.flowActions, int_action as IntAction];
      break;

    case "TAB_ACTION":
      const { url, tabId, windowId } = event.payload;
      const prevActions = context.flowActions;
      const prevNewTabAction = prevActions[prevActions.length - 1] as TabAction;
      const isLastNewTabAction = prevActions.length > 0 && prevNewTabAction.actionType === "NewTab" && prevNewTabAction.url === "chrome://new-tab-page/";
      const isNavigate = actionType === "Navigate";

      if(isLastNewTabAction && isNavigate){
        prevNewTabAction.url = url;
        return [...prevActions.filter( ac => ac.id !== prevNewTabAction.id), prevNewTabAction]
      }

      const tab_action = {};
      tab_action["id"] = guidGenerator();
      tab_action["actionType"] = event.actionType;
      tab_action["nestingLevel"] = 0;
      tab_action["url"] = url;
      tab_action["svg"] = InteractionDefintions.filter(
        (idata) =>
          idata.name.toLowerCase() === "keypress"
      )[0].svg;
      tab_action["tabId"] = tabId;
      tab_action["windowId"] = windowId;
      return [...context.flowActions, tab_action as TabAction];
      break;

    default:
      return context.flowActions;
      break;
  }
}

function saveToStorage(context: FlowContext) {
  const { flowActions } = context;
  const storageKey: TLocalStorageKey = "composeData";
  const stringified = JSON.stringify(flowActions);
  localStorage.setItem(storageKey, stringified);
  console.log(stringified);
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
  console.log("updateActiveTab");
  return event.newTabInfo;
}

function createAction(context: FlowContext, event: any) {
  console.log("createAction");
  const ACTION_EVENT_TYPE: "INTERACTION" | "CONDITIONALS" = event.type;
  let tempState: TAction[] = [];
  const { name, svg } : TInteractionPayload | TConditionalPayload = event.item; // TInteractionPayload, TConditionalPayload

  switch (ACTION_EVENT_TYPE) {
    case "INTERACTION":
      const props = {
        ...ActionNodeProps["Common"],
        ...ActionNodeProps[`${name}`],
      };
      const newInteractionAction: IntAction = {
        id: guidGenerator(),
        svg: svg,
        actionType: name as ActionEventTypes,
        recorded: false,
        props,
        nestingLevel: 0,
      };
      tempState.push(newInteractionAction);
      break;

    case "CONDITIONALS":
      const GeneralConditionDefaultTemplate : GeneralCondition = {
        selectedType: "Element",
        selectedOption: "IsVisible",
        requiresCheck: true,
        checkValue: "",
      };
      const newConditionAction: CondAction = {
        id: guidGenerator(),
        svg: svg,
        actionType: name as CondEventTypes,
        nestingLevel: 0,
        conditions: [ GeneralConditionDefaultTemplate ],
      };
      tempState.push(newConditionAction);
      break;

    default:
      break;
  }

  return [...context.flowActions, ...tempState];
}

function addConditionOperator(context: FlowContext, event: any) {
  console.log("addConditionOperator");
  const actionId = event.actionId;
  const selectedOperator = event.selection;
  const GeneralConditionDefaultTemplate : GeneralCondition = {
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

function updateCondition(context: FlowContext, event: any) {
  console.log("updateCondition");
  const {
    index,
    actionId,
    selection,
  }: TConditionalUpdatePayload = event;

  return context.flowActions.map((action) => {
    if (action.id === actionId) {
      const updatedCond = action["conditions"].map((cond: SelectableConditions, idx: number) => {
        if (idx === index) { // && cond.type !== "Operator"
          if (selection) {
            cond["selectedType"] = selection.conditionType;
            cond["selectedOption"] = selection.selectedOption;
            cond["requiresCheck"] = selection.requiresCheck;
          } else if (selection.requiresCheck && selection.value) {
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

function handleErrors(error: any) {
  console.log(error);
}

function restoreFlowActions(context: FlowContext, event: any) {
  console.log("restoreFlowActions");
  const storageKey: TLocalStorageKey = "composeData";
  const prevActions = localStorage.getItem(storageKey);
  return prevActions ? JSON.parse(prevActions) : [];
}

function itemReposition(context: FlowContext, event: any){
  console.log("itemReposition");
  const { updatedActions } = event;
  return updatedActions;
}

function evauateNesting(context: FlowContext, event: any) {
  const t0 = performance.now();

  console.log("evauateNesting() called. event: ", event);
  // only resolve if items have changed positions
  const {initialDraggedPos, currentDraggedPos } = event.dragInfo;

  // Exit early if items haven't changed positions.
  if(initialDraggedPos === currentDraggedPos) return context.flowActions;

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
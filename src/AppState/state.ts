import { createMachine, assign } from "xstate";
import {
  TAction,
  TCondition,
  TInteractionItemPayload,
  TUpdateConditionEventPayload,
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
          TAB_ACTIONS: {
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
      resolveNesting: assign({flowActions: evauateNesting})
    },
  }
);

function actionFromRecording(context: FlowContext, event: any) {
  console.log("actionFromRecording");
  const aType = event.actionType ? event.actionType : event.item.name;

  switch (aType) {
    case "Click":
      console.log('event.actionType === "Click"');
      const action = event.payload;
      action["recorded"] = true;
      action["id"] = guidGenerator();
      action["svg"] = InteractionDefintions.filter(
        (idata) =>
          idata.name.toLowerCase() === action.actionType.toLowerCase()
      )[0].svg;
      action["nestingLevel"] = 0;
      return [...context.flowActions, action as TAction];
      break;

    case "SelectTab":
      console.log('event.actionType === "SelectTab"');
      const select_action = {};
      select_action["actionType"] = "SelectTab";
      select_action["recorded"] = true;
      select_action["id"] = guidGenerator();
      select_action["svg"] = InteractionDefintions.filter(
        (idata) =>
          idata.name.toLowerCase() === "click"
      )[0].svg;
      select_action["nestingLevel"] = 0;
      return [...context.flowActions, select_action as TAction];
      break;

    case "Navigate":
      console.log('event.actionType === "Navigate"');
      console.log(event);
      const visit_action = {};
      visit_action["actionType"] = "Navigate";
      visit_action["recorded"] = true;
      visit_action["id"] = guidGenerator();
      visit_action["svg"] = GlobeIcon;
      visit_action["nestingLevel"] = 0;
      return [...context.flowActions, visit_action as TAction];
      break;

    case "NewTab":
      console.log('event.actionType === "NewTab"');
      const newtab_action = {};
      newtab_action["actionType"] = "NewTab";
      newtab_action["recorded"] = true;
      newtab_action["id"] = guidGenerator();
      newtab_action["svg"] = InteractionDefintions.filter(
        (idata) =>
          idata.name.toLowerCase() === "hover"
      )[0].svg;
      newtab_action["nestingLevel"] = 0;
      return [...context.flowActions, newtab_action as TAction];
      break;

    case "CloseTab":
      console.log('event.actionType === "CloseTab"');
      const closetab_action = {};
      closetab_action["actionType"] = "CloseTab";
      closetab_action["recorded"] = true;
      closetab_action["id"] = guidGenerator();
      closetab_action["svg"] = InteractionDefintions.filter(
        (idata) =>
          idata.name.toLowerCase() === "code"
      )[0].svg;
      closetab_action["nestingLevel"] = 0;
      return [...context.flowActions, closetab_action as TAction];
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
        // event: name,
        svg: svg,
        actionType: name, // previous value was ACTION_EVENT_TYPE or event.type
        props,
        nestingLevel: 0,
      };

      tempState.push(newInteractionAction);
      break;

    case "CONDITIONALS":
      const defaultCondition: TCondition = {
        selectedType: "Element",
        selectedOption: "IsVisible",
        requiresCheck: true,
        checkValue: "",
      };
      const newConditionAction: TAction = {
        id: guidGenerator(),
        // event: name,
        svg: svg,
        actionType: name, // previous value was ACTION_EVENT_TYPE or event.type
        conditions: [defaultCondition],
        nestingLevel: 0,
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
  console.log("updateCondition");
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
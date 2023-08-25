import { createMachine, assign, EventObject } from "xstate";
import {
  ActionNodeProps,
  InteractionDefinitions,
} from "../ActionsDefinitions/definitions.jsx";
import { TAction } from "../Types/ActionTypes/Action";
import {
  IntAction,
  IntActionTypes,
} from "../Types/ActionTypes/Interaction Actions";
import {
  ConditionalAction,
  SelectableConditions,
  GeneralCondition,
  CondEventTypes,
  CondEndEventTypes,
  CondEndAction,
} from "../Types/ActionTypes/Conditional Actions";
import { TabAction } from "../Types/ActionTypes/Tab Actions";
import { TComposeStorageKey } from "../Types/Storage Types";
import {
  TAppEvts,
  TEvtWithProps,
  Tidle,
} from "../Types/State Types/StateEvents";
import { TAppState, TAppContext } from "../Types/State Types/StateType";

import GlobeIcon from "../assets/globe";
import { SheetAction } from "../Types/ActionTypes/Sheet Action";

const commonEvents = {
  INTERACTION: {
    actions: ["newAction", "resolveNesting", "saveToStorage"],
  },
  CONDITIONALS: {
    actions: ["newAction", "resolveNesting", "saveToStorage"],
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
    actions: ["resolveNesting", "saveToStorage"],
  },
  NEW_SHEET: {
    actions: ["newAction", "resolveNesting"],
  },
};

async function getActionsFromStore(workflowname: string, db: any) {
  console.log("DB:", db, "workflowName: ", workflowname);
  try {
    const rows = await db.select("SELECT data FROM workflows WHERE name = ?", [
      workflowname,
    ]);
    console.log("DB rows data: ", rows, ", for Workflow: ", workflowname);
    if (rows && rows.length > 0) return JSON.parse(rows[0].data);
    else return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
const DB_SUB_STATE = {
  id: "DbState",
  states: {
    createWorkflow: {
      invoke: {
        id: "invoke-createWorkflow",
        src: (c: TAppContext, e: any) => {
          return new Promise(async (resolve, reject) => {
            try {
              const create_response = await e.db.execute(
                `CREATE TABLE IF NOT EXISTS workflows (name TEXT, data TEXT)`
              );
              console.log("create_response", create_response);
              resolve(create_response);
            } catch (error) {
              console.log("create_table error: ", error);
              if (error.includes("already exists")) {
                resolve("");
              } else reject(error);
            }
          });
        },
        onDone: "#Actionflow.idle",
        onError: "#Actionflow.error",
      },
    },
    saveWorkflow: {
      invoke: {
        id: "invoke-saveWorkflow",
        src: (context: TAppContext, event: any) => {
          return new Promise(async (resolve, reject) => {
            try {
              console.log(
                `DELETING '${event.workflowName}' ROWS FROM 'WORKFLOW' TABLE IN DB...`
              );
              const QUERY = `DELETE FROM workflows WHERE name = '${event.workflowName}'`;
              await event.db.execute(QUERY);

              console.log("INSERTING WORKFLOW UPDATE TO DB...");
              if (event.Workflow.length > 0)
                await event.db.execute(
                  `INSERT INTO workflows VALUES (?1, ?2)`,
                  [event.workflowName, JSON.stringify(event.Workflow)]
                );
              resolve(event.Workflow);
            } catch (error) {
              console.error(error);
              reject(error);
            }
          });
        },
        onDone: {
          target: "#Actionflow.idle",
          // actions: assign({ flowActions: (c, e) => e.data }),
        },
        onError: "#Actionflow.idle",
      },
    },
    getWorkflow: {
      invoke: {
        id: "invoke-getWorkflow",
        src: (context: TAppContext, event: any) => {
          console.log("invoke-selectDb");
          return getActionsFromStore(event.workflowName, event.db);
        },
        onDone: {
          target: "#Actionflow.idle",
          actions: assign({ flowActions: (c: TAppContext, e: any) => e.data }),
        },
        onError: "#Actionflow.error",
      },
    },
    clearWorkflow: {
      invoke: {
        id: "invoke-clearWorkflow",
        src: (c: TAppContext, e: any) => {
          console.log(`CLEARING '${e.workflowName}' from 'WORKFLOW' TABLE`);
          const QUERY = `DELETE FROM workflows WHERE name = '${e.workflowName}'`;
          return e.db.execute(QUERY);
        },
        onDone: "#DbState.getWorkflow",
        onError: "#Actionflow.error",
      },
    },
  },
};

export const AppStateMachine = createMachine<
  TAppContext,
  TAppEvts,
  TAppState<TAppContext>
>(
  {
    predictableActionArguments: true,
    id: "Actionflow",
    initial: "idle", // /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) ? "idle" : "restoring",
    context: {
      flowActions: [],
      activeTab: null,
    },
    states: {
      restoring: {
        on: {
          RESTORE_ACTIONS: {
            target: "#DbState.getWorkflow",
          },
        },
      },
      idle: {
        on: {
          ...commonEvents,
          START_RECORD: {
            target: "#Actionflow.recording",
          },
          CREATE_TABLE: {
            target: "#DbState.createWorkflow",
          },
          INSERT_TO_DB: {
            target: "#DbState.saveWorkflow",
          },
          CLEAR_WORKFLOW: {
            target: "#DbState.clearWorkflow",
          },
          UPDATE_INTERACTION: {
            target: "#Actionflow.idle",
            actions: ["updateInteraction"],
          },
          UPDATE_ACTION_FROM_FRAME: {
            actions: assign({
              flowActions: (context, event: any) => event.actions,
            }),
          },
        },
      },
      dbOperations: { ...DB_SUB_STATE },
      recording: {
        on: {
          ...commonEvents,
          RECORDED_ACTION: {
            actions: ["recordedAction", "resolveNesting", "saveToStorage"],
          },
          STOP_RECORD: {
            target: "#Actionflow.idle",
          },
          ERROR: "handleError",
          UPDATE_RECORDED_ACTION: {
            actions: ["recordedAction", "saveToStorage"],
          },
          UPDATE_INTERACTION: {
            target: "#Actionflow.recording",
            actions: ["updateInteraction"],
          },
        },
      },
      handleError: {
        invoke: {
          id: "handle-error",
          src: (_context, event: any) => {
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
      activeTab: assign({ activeTab: updateActiveTab }),
      recordedAction: assign({ flowActions: actionFromRecording }),
      saveToStorage: saveToStorage,
      resolveNesting: assign({
        flowActions: (c: TAppContext, e: TEvtWithProps) => {
          const val = evauateNesting(c, e);
          return val;
        },
      }),
      updateTab: assign({ flowActions: updateTabAction }),
      updateInteraction: assign({ flowActions: updateInteractionAction }),
    },
  }
);

function updateInteractionAction(
  context: TAppContext,
  event: TEvtWithProps
): TAction[] {
  console.log("in updateInteractionAction state action handler");

  if (event.type != "UPDATE_INTERACTION") return;

  const interactionType = event.propType;
  const actionId = event.actionId;
  switch (interactionType) {
    case "Common":
      console.log("in Common case");
      const newSelector = event.props;
      console.log({ newSelector });
      const updatedCommonProps = context.flowActions.map((action) => {
        if (action.id === actionId && "props" in action) {
          return {
            ...action,
            props: {
              ...action.props,
              selector: newSelector.selector,
            },
          } as TAction;
        } else return action;
      });
      console.log("updatedCommonProps: ", updatedCommonProps);
      return updatedCommonProps;
      break;

    case "Click":
      console.log("in Click case");
      const newClickProps = event.props;
      const updatedClickProps = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Click") {
          return {
            ...action,
            props: {
              ...action.props,
              "Wait For New Page To load":
                newClickProps["Wait For New Page To load"],
              "Wait For File Download": newClickProps["Wait For File Download"],
              Description: newClickProps["Description"],
            },
          };
        } else return action;
      });
      console.log("updated click props action: ", updatedClickProps);
      return updatedClickProps;
      break;
    case "Type":
      console.log("in Type case");
      const newTypeProps = event.props;
      const updatedTypeProps = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Type") {
          return {
            ...action,
            props: {
              ...action.props,
              Text: newTypeProps["Text"],
              "Overwrite Existing Text":
                newTypeProps["Overwrite Existing Text"],
            },
          };
        } else return action;
      });
      console.log("updatedTypeProps action: ", updatedTypeProps);
      return updatedTypeProps;
      break;
    case "Hover":
      console.log("in Hover case");
      const newHoverProps = event.props;
      const updatedHoverProps = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Hover") {
          return {
            ...action,
            props: {
              ...action.props,
              Description: newHoverProps["Description"],
            },
          } as TAction;
        } else return action;
      });
      console.log("updatedHoverProps action: ", updatedHoverProps);
      return updatedHoverProps;
      break;
    case "Keypress":
      console.log("in Keypress case");
      const newKeypressProps = event.props;
      const updatedKeypressProps = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType == "Keypress") {
          return {
            ...action,
            props: {
              ...action.props,
              Key: newKeypressProps["Key"],
              "Wait For Page To Load":
                newKeypressProps["Wait For Page To Load"],
            },
          };
        } else return action;
      });
      console.log("updatedKeypressProps action: ", updatedKeypressProps);
      return updatedKeypressProps;
      break;
    case "Select":
      console.log("in Select case");
      const newSelectProps = event.props;
      const updatedSelectProps = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Select") {
          return {
            ...action,
            props: {
              ...action.props,
              Selected: newSelectProps["Selected"],
              Description: newSelectProps["Description"],
            },
          };
        } else return action;
      });
      console.log("updatedSelectProps action: ", updatedSelectProps);
      return updatedSelectProps;
      break;
    case "Code":
      console.log("in Code case");
      const newCodeProps = event.props;
      const updatedCodeProps = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Code") {
          return {
            ...action,
            props: {
              ...action.props,
              value: newCodeProps["value"],
              vars: newCodeProps["vars"],
            },
          };
        } else return action;
      });
      console.log("updatedCodeProps action: ", updatedCodeProps);
      return updatedCodeProps;
      break;
    case "Scroll":
      break;
    case "Upload":
      break;
    case "Date":
      break;
    case "Prompts":
      break;
  }
}

function updateTabAction(context, event) {
  return context.flowActions.map((act) => {
    if (act.id === event.updated_action.id) return event.updated_action;
    else return act;
  });
}

function actionFromRecording(context, event) {
  console.log("actionFromRecording");
  const actionType = event.actionType;
  let currentAction = null;

  if (
    ["Click", "Type", "Keypress", "Select", "Hover", "Prompts"].includes(
      actionType
    )
  )
    currentAction = "INT_ACTION";
  if (
    [
      "SelectTab",
      "SelectWindow",
      "Navigate",
      "NewTab",
      "NewWindow",
      "CloseTab",
      "CloseWindow",
      "Back",
      "Forward",
    ].includes(actionType)
  )
    currentAction = "TAB_ACTION";

  switch (currentAction) {
    case "INT_ACTION":
      const int_action = event.payload;

      const prevlastAction = context.flowActions[
        context.flowActions.length - 1
      ] as IntAction;
      if (
        prevlastAction &&
        ["Type", "Select"].includes(prevlastAction?.actionType) &&
        prevlastAction.props.selector === int_action.props.selector
      )
        return context.flowActions.map((a) => {
          if (a.id === prevlastAction.id)
            return { ...a, props: int_action.props };
          else return a;
        });

      int_action["recorded"] = true;
      int_action["id"] = guidGenerator();
      int_action["nestingLevel"] = 0;
      return [...context.flowActions, int_action as IntAction];
      break;

    case "TAB_ACTION":
      const { url, tabId, windowId } = event.payload;
      const prevActions = context.flowActions;
      const prevNewTabAction = prevActions[prevActions.length - 1] as TabAction;
      const isLastNewTabAction =
        prevActions.length > 0 &&
        prevNewTabAction.actionType === "NewTab" &&
        prevNewTabAction.url === "chrome://new-tab-page/";
      const isNavigateAction = actionType === "Navigate";

      if (isLastNewTabAction && isNavigateAction) {
        prevNewTabAction.url = url;
        return [
          ...prevActions.filter((ac) => ac.id !== prevNewTabAction.id),
          prevNewTabAction,
        ];
      }

      const tab_action = {};
      tab_action["id"] = guidGenerator();
      tab_action["actionType"] = event.actionType;
      tab_action["nestingLevel"] = 0;
      tab_action["url"] = url;
      tab_action["tabId"] = tabId;
      tab_action["windowId"] = windowId;
      return [...context.flowActions, tab_action as TabAction];
      break;

    default:
      return context.flowActions;
      break;
  }
}

function saveToStorage(context: TAppContext) {
  const { flowActions } = context;
  const storageKey: TComposeStorageKey = "composeData";
  const stringified = JSON.stringify(flowActions);
  localStorage.setItem(storageKey, stringified);
  // console.log(stringified);
  console.log(flowActions);
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

function updateActiveTab(_context: TAppContext, event: any) {
  console.log("updateActiveTab");
  return event.newTabInfo;
}

function createAction(context: TAppContext, event) {
  console.log("createAction");
  const ACTION_EVENT_TYPE = event.type;
  let tempState: TAction[] = [];
  const { name, svg } = event.item;

  switch (ACTION_EVENT_TYPE) {
    case "INTERACTION":
      const props = {
        ...ActionNodeProps["Common"],
        ...ActionNodeProps[`${name}`],
      };
      const newInteractionAction: IntAction = {
        id: guidGenerator(),
        actionType: name satisfies IntActionTypes,
        recorded: false,
        props,
        nestingLevel: 0,
      };
      tempState.push(newInteractionAction);
      break;

    case "CONDITIONALS":
      const ctype =
        name === "IF"
          ? "IF"
          : name === "ELSE"
          ? "ELSE"
          : name === "WHILE"
          ? "WHILE"
          : "END";
      const GeneralConditionDefaultTemplate: GeneralCondition = {
        selectedType: "Element",
        selectedOption: "IsVisible",
        requiresCheck: true,
        checkValue: "",
      };
      const newConditionAction: ConditionalAction | CondEndAction = {
        id: guidGenerator(),
        actionType: ctype satisfies
          | ConditionalAction["actionType"]
          | CondEndAction["actionType"],
        nestingLevel: 0,
        conditions: [GeneralConditionDefaultTemplate],
      };
      tempState.push(newConditionAction);
      break;

    case "NEW_SHEET":
      const newSheet: SheetAction = {
        id: guidGenerator(),
        actionType: "Sheet" satisfies SheetAction["actionType"],
        props: {},
        nestingLevel: 0,
      };
      tempState.push(newSheet);

    default:
      break;
  }

  return [...context.flowActions, ...tempState];
}

function addConditionOperator(context: TAppContext, event: TEvtWithProps) {
  console.log("addConditionOperator");
  if (event.type !== "ADD_CONDITION_OPERATOR") return;

  const actionId = event.actionId;
  const selectedOperator = event.selection;
  const GeneralConditionDefaultTemplate: GeneralCondition = {
    selectedType: "Element",
    selectedOption: "IsVisible",
    requiresCheck: true,
    checkValue: "",
  };
  const prevConditions = context.flowActions.filter(
    ({ id }) => id === actionId
  )[0]["conditions"];
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

function updateCondition(context: TAppContext, event: TEvtWithProps) {
  console.log("updateCondition");
  if (event.type != "UPDATE_CONDITION") return;
  const payload = event.payload;

  const { index, actionId } = payload;

  return context.flowActions.map((action) => {
    if (action.id === actionId) {
      const updatedCond = action["conditions"].map(
        (cond: SelectableConditions, idx: number) => {
          if (idx === index) {
            if ("selection" in payload) {
              cond["selectedType"] = payload.selection.conditionType;
              cond["selectedOption"] = payload.selection.selectedOption;
            } else if ("checkValue" in payload) {
              cond["checkValue"] = payload.checkValue;
            }
          }
          return cond;
        }
      );
      return { ...action, conditions: updatedCond };
    }

    return action;
  });
}

function handleErrors(error: any) {
  console.log(error);
}

function restoreFlowActions(context: TAppContext, event: any) {
  console.log("restoreFlowActions");
  const storageKey: TComposeStorageKey = "composeData";
  const prevActions = localStorage.getItem(storageKey);
  return prevActions ? JSON.parse(prevActions) : [];
}

function evauateNesting(context: TAppContext, event: TEvtWithProps) {
  console.log("evauateNesting() called. event: ", event);

  const t0 = performance.now();

  let changedActions =
    event.type === "DRAG_EVENT" ? event.payload.dragInfo : context.flowActions;
  let nestingLevel = 0;
  let prevAction = null;
  let PrevIfCount = 0;
  let marginLeft = 0;
  const newActions = changedActions.map((action) => {
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
      marginLeft: marginLeft,
    };

    prevAction = action;
    return updatedAction;
  });

  const t1 = performance.now();
  console.log(`Evaluating Nesting took ${t1 - t0} milliseconds.`);

  return newActions;
}

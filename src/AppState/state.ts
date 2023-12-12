import { createMachine, assign } from "xstate";
import { ActionNodeProps } from "../ActionsDefinitions/definitions";
import { TAppContext, TAppState } from "../Schemas/replaceTypes/StateType";
import { TAppEvents } from "../Schemas/replaceTypes/StateEvents";
import {
  SheetActionSchema,
  SheetActionTypeSchema,
} from "../Schemas/replaceTypes/Actions";
import type {
  TAction,
  TComposeStorageKey,
  TConditionAction,
  TGeneralCondition,
  TIntAction,
  TResolveAction,
  TTabsAction,
} from "../Schemas/replaceTypes/Actions";
import {
  AddOperatorEventSchema,
  CreateInteractionActionEventSchema,
  CreateRecordedActionEventSchema,
  UpdateConditionActionEventSchema,
  UpdateInteractionActionEventSchema,
} from "../Schemas/SateEventsSchema";
import {
  BarrierActionSchema,
  BarrierActionTypesSchema,
  ConditionActionSchema,
  IfWhileActionTypesSchema,
} from "../Schemas/ConditionalsSchema";
import {
  IntActionSchema,
  IntActionTypesSchema,
} from "../Schemas/InteractionsSchema";
import { TabActionTypesSchema, TabsActionSchema } from "../Schemas/TabsSchema";
import { ActionCategorySchema } from "../Schemas/ActionsSchema";

const commonEvents = {
  CREATE_ACTION: {
    actions: ["newAction", "resolveNesting"],
  },
  DRAG_ACTION_UPDATE: {
    actions: assign({flowActions: (c, e) => e.payload}),
  },
  ADD_OPERATOR: {
    actions: ["newOperator"],
  },
  UPDATE_CONDITION: {
    actions: ["newCondition", "saveToStorage"],
  },
  UPDATE_TAB: {
    actions: ["updateTab", "saveToStorage"],
  },
  UPDATE_ACTIVE_TAB: {
    actions: ["activeTab"],
  },
  DRAG_EVENT: {
    actions: ["resolveNesting"], // "toggleOnDrop",
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

// SQLITE OPERATIONS
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
            } catch (error: any) {
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

// TAURI ACTION TICKER EVENT STATE
const TAURI_ACTION_TICKER_EVENTS = {
  UPDATE_CURRENT_ACTION_TICKER_ID: {
    target: "#Actionflow.idle",
    actions: ["taskActionUpdate"],
  },
  RESET_ACTION_TICKER_ID: {
    target: "#Actionflow.idle",
    actions: assign({ currentActionTickerId: null }),
  },
};

// const REACT_FLOW_STATE = {
//   initial: "react-flow-state",
//   context: {
//     nodes: null,
//     edges: null,
//   },
//   states: {
//     edit : {
//       on: {
//         ADD_NODE: { actions: assign({ nodes: (context, event) => context.nodes.push(event.node) }) },
//         DELETE_NODE: { actions: assign({ nodes: (context, event) => context.nodes.filter(n => n.id !== event.id)}) },

//         ON_NODES_CHANGE: { actions: assign({ nodes: (context, event) => applyNodeChanges(event.changes, context.nodes)}) },
//         ON_EDGESCHANGE: { actions: assign({ edges: (context, event) => applyNodeChanges(event.changes, context.edges)}) },
//         ON_CONNECT: { actions: assign({ edges: (context, event) => addEdge(event.connection, context.edges)}) },
//         ON_NODE_DRAG: { actions: assign({}) },

//         ADD_EDGE: { actions: assign({ edges: (context, event) => context.edges.push(event.edge}) },
//         DELETE_EDGE: { actions: assign({ edges: (context, event) => context.edges.filter(n => n.id !== event.id)}) },
//       }
//     }
//   }
// }

export const AppStateMachine = createMachine<
  TAppContext,
  TAppEvents,
  TAppState<TAppContext>
>(
  {
    predictableActionArguments: true,
    id: "Actionflow",
    initial: "idle", // /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) ? "idle" : "restoring",
    context: {
      flowActions: [],
      activeTab: undefined,
      currentActionTickerId: undefined,
      itemDroppedToggle: false,
    },
    states: {
      // restoring: {
      //   on: {
      //     READ_WORKFLOW: {
      //       target: "#DbState.getWorkflow",
      //     },
      //   },
      // },
      idle: {
        on: {
          ...commonEvents,
          START_RECORD: {
            target: "#Actionflow.recording",
          },
          // CREATE_WORKFLOW: {
          //   target: "#DbState.createWorkflow",
          // },
          // READ_WORKFLOW: {
          //   target: "#DbState.getWorkflow",
          // },
          // UPDATE_WORKFLOW: {
          //   target: "#DbState.saveWorkflow",
          // },
          // DELETE_WORKFLOW: {
          //   target: "#DbState.clearWorkflow",
          // },
          UPDATE_INTERACTION: {
            target: "#Actionflow.idle",
            actions: ["updateInteraction"],
          },
          ...TAURI_ACTION_TICKER_EVENTS, //       <-- STATE UPDATE SENT FROM TAURI RUN
          UPDATE_WORKFLOW_FROM_TAURI: {
            target: "#Actionflow.idle",
            actions: ["updateTauriWorkflow"],
          },
          DELETE_ACTION: {
            target: "#Actionflow.idle",
            actions: assign({
              flowActions: (c: TAppContext, e) =>
                c.flowActions.filter((a) => a.id !== e.actionId),
            }),
          },

        },
      },
      // dbOperations: { ...DB_SUB_STATE },
      recording: {
        on: {
          ...commonEvents,
          RECORDED_ACTION: {
            actions: ["recordedAction", "resolveNesting"],
          },
          STOP_RECORD: {
            target: "#Actionflow.idle",
          },
          ERROR: "handleError",
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
        flowActions: (c: TAppContext, e) => {
          console.log("resolveNesting called with event: ", e);
          if (e.type === "CREATE_ACTION" || e.type === "RECORDED_ACTION") {
            if (c?.flowActions?.length > 0) {
              const updated_actions_nesting = EvaluateNesting(c.flowActions);
              return updated_actions_nesting;
            }
          } else if (e.type === "DRAG_EVENT") {
            if (e?.payload) {
              const updated_actions_nesting = EvaluateNesting(e.payload);
              return updated_actions_nesting;
            }
          }

          return c.flowActions;
        },
      }),
      updateTab: assign({ flowActions: updateTabAction }),
      updateInteraction: assign({ flowActions: updateInteractionAction }),
      taskActionUpdate: assign({
        currentActionTickerId: (c: TAppContext, e: TAppEvents) => {
          console.log("updating action ticker id");
          return e.id;
        },
      }),
      updateTauriWorkflow: assign({
        flowActions: (c: TAppContext, e: TAppEvents) => e.workflow,
      }),
      toggleOnDrop: assign({
        itemDroppedToggle: (c: any, e: any) => !c.itemDroppedToggle,
      }),
    },
  }
);

function updateInteractionAction(
  context: TAppContext,
  event: TAppEvents
): TAction[] {
  console.log("in updateInteractionAction state action handler");

  const parsedIntAction = UpdateInteractionActionEventSchema.safeParse(event);
  if (!parsedIntAction.success) {
    console.warn(parsedIntAction.error);
    return context.flowActions;
  }

  const actionId = parsedIntAction.data.payload.actionId;
  const interactionType = context.flowActions.filter(
    (a) => a.id === parsedIntAction.data.payload.actionId
  )[0].actionType;

  switch (interactionType) {
    case "URL":
      console.log("In URL Update Interaction Switch Case");
      const newURLProps = parsedIntAction.data.payload.props;

      return context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "URL") {
          return {
            ...action,
            props: {
              value: newURLProps?.value ?? action.props.value,
              variable: newURLProps?.variable ?? action.props.variable,
            },
          };
        } else return action;
      });
    case "Anchor":
      console.log("In Anchor Update Interaction Switch Case");
      const newAnchorProps = parsedIntAction.data.payload.props;
      const updatedAnchorAction = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Anchor") {
          return {
            ...action,
            props: {
              nodeName: newAnchorProps?.nodeName ?? action.props.nodeName,
              selector: newAnchorProps?.selector ?? action.props.selector,
              value: newAnchorProps?.value ?? action.props.value,
              variable: newAnchorProps?.variable ?? action.props.variable,
            },
          };
        } else return action;
      });
      return updatedAnchorAction;
    case "Attribute":
      console.log("In Attribute Update Interaction Switch Case");
      const newAttributeProps = parsedIntAction.data.payload.props;
      const updatedAttributeAction = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Attribute") {
          return {
            ...action,
            props: {
              nodeName: newAttributeProps?.nodeName ?? action.props?.nodeName,
              selector: newAttributeProps?.selector ?? action.props?.selector,
              value: newAttributeProps?.value ?? action.props?.value,
              attribute: newAttributeProps?.attribute ?? action.props?.value,
              variable: newAttributeProps?.variable ?? action.props?.variable,
            },
          };
        } else return action;
      });
      return updatedAttributeAction;
    case "Text":
      console.log("In Text Update Interaction Switch Case");
      const newTextProps = parsedIntAction.data.payload.props;
      const updatedTextAction = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Text") {
          return {
            ...action,
            props: {
              nodeName: newTextProps?.nodeName ?? action.props.nodeName,
              selector: newTextProps?.selector ?? action.props.selector,
              value: newTextProps?.value ?? action.props.value,
              variable: newTextProps?.variable ?? action.props.variable,
            },
          };
        } else return action;
      });
      console.log(updatedTextAction);
      return updatedTextAction;
    case "List":
      console.log("In List Update Interaction Switch Case");
      const newListProps = parsedIntAction.data.payload.props;
      const updatedListAction = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "List") {
          return {
            ...action,
            props: {
              nodeName: newListProps?.nodeName ?? action.props.nodeName,
              selector: newListProps?.selector ?? action.props.selector,
              variable: newListProps?.variable ?? action.props.variable,
            },
          };
        } else return action;
      });
      return updatedListAction;
    case "Click":
      console.log("in Click Update Interaction Switch Case");
      const newClickProps = parsedIntAction.data.payload.props;
      const updatedClickProps = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Click") {
          return {
            ...action,
            props: {
              nodeName: newClickProps?.nodeName ?? action.props.nodeName,
              selector: newClickProps?.selector ?? action.props.selector,
              "Wait For New Page To Load":
                newClickProps["Wait For New Page To Load"] ??
                action.props["Wait For New Page To Load"],
              "Wait For File Download":
                newClickProps["Wait For File Download"] ??
                action.props["Wait For File Download"],
              Description:
                newClickProps["Description"] ?? action.props["Description"],
            },
          };
        } else return action;
      });
      console.log("updated click props action: ", updatedClickProps);
      return updatedClickProps;
    case "Type":
      console.log("in Type Update Interaction Switch Case");
      const newTypeProps = parsedIntAction.data.payload.props;
      const updatedTypeProps = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Type") {
          return {
            ...action,
            props: {
              ...action.props,
              nodeName: newTypeProps?.nodeName ?? action.props.nodeName,
              selector: newTypeProps?.selector ?? action.props.selector,
              Text: newTypeProps["Text"] ?? action.props.Text,
              "Overwrite Existing Text":
                newTypeProps["Overwrite Existing Text"] ??
                action.props["Overwrite Existing Text"],
            },
          };
        } else return action;
      });
      console.log("updatedTypeProps action: ", updatedTypeProps);
      return updatedTypeProps;
    case "Hover":
      console.log("in Hover Update Interaction Switch Case");
      const newHoverProps = parsedIntAction.data.payload.props;
      const updatedHoverProps = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Hover") {
          return {
            ...action,
            props: {
              nodeName: newHoverProps?.nodeName ?? action.props.nodeName,
              selector: newHoverProps?.selector ?? action.props.selector,
              Description: newHoverProps["Description"],
            },
          } as TAction;
        } else return action;
      });
      console.log("updatedHoverProps action: ", updatedHoverProps);
      return updatedHoverProps;
    case "Keypress":
      console.log("in Keypress Update Interaction Switch Case");
      const newKeypressProps = parsedIntAction.data.payload.props;
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
    case "Select":
      console.log("in Select Update Interaction Switch Case");
      const newSelectProps = parsedIntAction.data.payload.props;
      const updatedSelectProps = context.flowActions.map((action) => {
        if (action.id === actionId && action.actionType === "Select") {
          return {
            ...action,
            props: {
              nodeName: newSelectProps?.nodeName ?? action.props.nodeName,
              selector: newSelectProps?.selector ?? action.props.selector,
              Selected: newSelectProps?.Selected ?? action.props.Selected,
              Options: newSelectProps?.options ?? action.props.Options,
              Description:
                newSelectProps?.Description ?? action.props.Description,
            },
          };
        } else return action;
      });
      console.log("updatedSelectProps action: ", updatedSelectProps);
      return updatedSelectProps;
    case "Code":
      console.log("in Code Update Interaction Switch Case");
      const newCodeProps = parsedIntAction.data.payload.props;

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
    case "Scroll":
      break;
    case "Upload":
      break;
    case "Date":
      break;
    case "Prompts":
      break;
  }

  return context.flowActions;
}

function updateTabAction(context: TAppContext, event: TAppEvents) {
  if (event.type !== "UPDATE_TAB") return context.flowActions;

  return (context.flowActions as any).map((act: any) => {
    if (act.id === event.payload.action.id) return event.payload.action;
    else return act;
  });
}

function actionFromRecording(context: TAppContext, event: TAppEvents) {
  console.log("actionFromRecording, event: ", event);

  const parsedEvent = CreateRecordedActionEventSchema.safeParse(event);
  if (!parsedEvent.success) {
    console.warn(parsedEvent.error);
    return context.flowActions;
  }

  const actionType = parsedEvent.data.payload.actionType;
  const parsedIntTypes = IntActionTypesSchema.safeParse(actionType);

  if (parsedIntTypes.success) {
    const newRecordedIntAction = {
      id: guidGenerator(),
      recorded: true,
      nestingLevel: 0,
      actionType: parsedIntTypes.data,
      props: parsedEvent.data.payload.props,
    };

    const parsedIntAction = IntActionSchema.safeParse(newRecordedIntAction);

    if (parsedIntAction.success) {
      const prevlastAction =
        context.flowActions[context.flowActions.length - 1];

      if (
        prevlastAction &&
        ["Type", "Select"].includes(prevlastAction?.actionType) &&
        "props" in prevlastAction &&
        "selector" in prevlastAction.props &&
        prevlastAction.props.selector === newRecordedIntAction.props.selector
      ) {
        context.flowActions = context.flowActions.map((a) => {
          if (a.id === prevlastAction.id)
            return { ...a, props: newRecordedIntAction.props };
          else return a;
        });

        return context.flowActions;
      }

      context.flowActions.push(parsedIntAction.data);

      return context.flowActions;
    } else if (parsedIntAction.error) {
      console.warn(parsedIntAction.error);
    }
  }

  const parsedTabTypes = TabActionTypesSchema.safeParse(actionType);
  if (parsedTabTypes.success) {
    const newRecordedTabAction = {
      id: guidGenerator(),
      recorded: true,
      nestingLevel: 0,
      actionType: parsedTabTypes.data,
      props: parsedEvent.data.payload.props,
    } satisfies TTabsAction;

    const parsedTab = TabsActionSchema.safeParse(newRecordedTabAction);

    if (parsedTab.success) {
      const { url, tabId, windowId } = parsedEvent.data.payload.props;
      const prevActions: TAction[] = context.flowActions;
      const prevNewTabAction = prevActions[prevActions.length - 1];
      const isLastNewTabAction =
        prevActions.length > 0 &&
        prevNewTabAction.actionType === "NewTab" &&
        prevNewTabAction.props.url === "chrome://new-tab-page/";
      const isNavigateAction = actionType === "Navigate";

      // Check if the last action was a "NewTab" and the current action is a "Navigate" action.
      // if 'true', update the url prop of the "NewTab" action instead of adding the "Navigate" action as a new action.
      if (isLastNewTabAction && isNavigateAction) {
        prevNewTabAction.props.url = url;
        return [
          ...prevActions.filter((ac) => ac.id !== prevNewTabAction.id),
          prevNewTabAction,
        ];
      }

      if (
        actionType === "NewTab" &&
        prevActions[0] &&
        "tabId" in prevActions[0] &&
        prevActions[0].tabId === tabId
      ) {
        return context.flowActions;
      }

      context.flowActions.push(parsedTab.data);

      return context.flowActions;
    } else if (parsedTab.error) {
      console.warn(parsedTab.error);
    }
  }

  return context.flowActions;
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

function updateActiveTab(_context: TAppContext, event: TAppEvents) {
  console.log("updateActiveTab");
  if (event.type !== "UPDATE_ACTIVE_TAB") return undefined;

  return event.payload.newTabInfo;
}

function createAction(context: TAppContext, event: TAppEvents) {
  console.log("createAction");

  const parsedEvent = CreateInteractionActionEventSchema.safeParse(event);
  if (!parsedEvent.success) {
    console.warn(parsedEvent.error);
    return context.flowActions;
  }

  const actionType = parsedEvent.data.payload.actionType;
  const ActionCategory = ActionCategorySchema.safeParse(actionType);
  if (ActionCategory.success) {
    switch (ActionCategory.data) {
      case "INTERACTION":
        const parsedIntActionType = IntActionTypesSchema.parse(actionType);
        let newInteractionAction: TIntAction;

        newInteractionAction = {
          id: guidGenerator(),
          actionType: parsedIntActionType,
          recorded: false,
          props: {
            ...ActionNodeProps["Common"],
            ...ActionNodeProps[`${parsedIntActionType}`],
          },
          nestingLevel: 0,
        } as TIntAction;

        const parsedIntAction = IntActionSchema.safeParse(newInteractionAction);
        if (parsedIntAction.success) {
          if (newInteractionAction)
            context.flowActions.push(newInteractionAction);
          return context.flowActions;
        } else console.warn(parsedIntAction.error);
        break;

      case "IF-WHILE":
        const parsedIfWhileActionType =
          IfWhileActionTypesSchema.parse(actionType);
        if (parsedIfWhileActionType) {
          const GeneralConditionDefaultTemplate: TGeneralCondition = {
            selectedVariable: "",
            selectedType: "Element",
            selectedOption: "IsVisible",
            requiresCheck: true,
            checkValue: "",
          };
          const newConditionAction: TConditionAction = {
            id: guidGenerator(),
            actionType: parsedIfWhileActionType,
            nestingLevel: 0,
            conditions: [GeneralConditionDefaultTemplate],
          };

          const parsedIFWHILE =
            ConditionActionSchema.safeParse(newConditionAction);
          if (parsedIFWHILE.success) {
            context.flowActions.push(newConditionAction);
            return context.flowActions;
          } else console.warn(parsedIFWHILE.error);
        }
        break;

      case "BARRIER":
        const parsedBarrierActionType =
          BarrierActionTypesSchema.safeParse(actionType);
        if (parsedBarrierActionType.success) {
          const newBarrierAction = {
            id: guidGenerator(),
            actionType: parsedBarrierActionType.data,
            nestingLevel: 0,
          };
          const parsedBarrier = BarrierActionSchema.safeParse(newBarrierAction);
          if (parsedBarrier.success) {
            context.flowActions.push(newBarrierAction);
            return context.flowActions;
          } else console.warn(parsedBarrier.error);
        } else if (parsedBarrierActionType.error) {
          console.warn(parsedBarrierActionType.error);
        }
        break;

      case "TABS":
        const parsedTabActionType = TabActionTypesSchema.parse(actionType);
        const newTabAction = {
          id: guidGenerator(),
          actionType: parsedTabActionType,
          nestingLevel: 0,
          recorded: false,
          props: ActionNodeProps.Tab,
        } satisfies TTabsAction;

        const parsedTab = TabsActionSchema.safeParse(newTabAction);
        if (parsedTab.success) {
          context.flowActions.push(newTabAction);
          return context.flowActions;
        } else console.warn(parsedTab.error);
        break;

      case "SHEET": {
        const parsedSheetActionType = SheetActionTypeSchema.parse(actionType);
        const newSheet = {
          id: guidGenerator(),
          actionType: parsedSheetActionType,
          props: {},
          nestingLevel: 0,
        };

        const parsedSheet = SheetActionSchema.safeParse(newSheet);
        if (parsedSheet.success) {
          context.flowActions.push(newSheet);
          return context.flowActions;
        } else console.warn(parsedSheet.error);
      }
      default:
        console.error(`${ActionCategory.data} CATEGORY NOT SUPPORTED`);
    }
  } else {
    console.error(ActionCategory.error);
  }

  return context.flowActions;
}

function addConditionOperator(context: TAppContext, event: TAppEvents) {
  console.log("addConditionOperator");

  const parsedEvent = AddOperatorEventSchema.safeParse(event);

  if (!parsedEvent.success) {
    console.warn(parsedEvent.error);
    return context.flowActions;
  }

  const actionId = parsedEvent.data.payload.actionId;
  const selectedOperator = parsedEvent.data.payload.selection;
  const GeneralConditionDefaultTemplate = {
    selectedVariable: "",
    selectedType: "Element",
    selectedOption: "IsVisible",
    requiresCheck: true,
    checkValue: "",
  } satisfies TGeneralCondition;

  return context.flowActions.map((action) => {
    if (action.id === actionId && "conditions" in action) {
      return {
        ...action,
        conditions: [
          ...action.conditions,
          {
            type: "Operator",
            selected: selectedOperator,
          } satisfies TResolveAction<"Operator">,
          GeneralConditionDefaultTemplate,
        ],
      };
    } else return action;
  });
}

function updateCondition(context: TAppContext, event: TAppEvents) {
  console.log("updateCondition");
  if (event.type != "UPDATE_CONDITION") return context.flowActions;

  const parsedEvent = UpdateConditionActionEventSchema.safeParse(event);
  if (!parsedEvent.success) {
    console.warn(parsedEvent.error);
    return context.flowActions;
  }

  const payload = parsedEvent.data.payload;
  const { index: actionIndex, actionId } = payload;

  const updatedCondition = context.flowActions.map((action) => {
    if (action.id === actionId && "conditions" in action) {
      const updatedCond = action["conditions"].map((cond, idx: number) => {
        if (idx === actionIndex) {
          if ("selection" in payload) {
            if (
              "selectedType" in cond &&
              "selectedOption" in payload.selection &&
              "selectedType" in payload.selection
            ) {
              cond["selectedOption"] = payload.selection.selectedOption
                ? payload.selection?.selectedOption
                : cond["selectedOption"];
              cond["selectedType"] = payload.selection.selectedType
                ? payload.selection?.selectedType
                : cond["selectedType"];
            } else if (
              "selectedVariable" in cond &&
              "selectedVariable" in payload.selection
            ) {
              cond["selectedVariable"] = payload.selection?.selectedVariable
                ? payload.selection?.selectedVariable
                : "";
            }
          } else if ("checkValue" in payload && "checkValue" in cond) {
            cond["checkValue"] = payload.checkValue;
          }
        }
        return cond;
      });
      return { ...action, conditions: updatedCond };
    }

    return action;
  });

  return updatedCondition;
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

export function EvaluateNesting(actions: TAction[]) {
  // console.log("EvaluateNesting() called");

  const t0 = performance.now();

  let nestingLevel = 0;
  let prevAction: TAction | null = null;
  let PrevIfCount = 0;
  let marginLeft = 0;

  const newActions = actions?.map((action) => {
    if(!action)
      return;

    if (
      prevAction?.actionType === "IF" ||
      prevAction?.actionType === "List" ||
      prevAction?.actionType === "WHILE" ||
      prevAction?.actionType === "ELSE"
    ) {
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
  // console.log(`Evaluating Nesting took ${t1 - t0} milliseconds.`);

  return newActions;
}

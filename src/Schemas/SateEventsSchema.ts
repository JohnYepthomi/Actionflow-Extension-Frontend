/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */
/*     TYPES OF WORKFLOW STATE EVENTS
/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */
//      01. Create New Action Event. -
//      02. Create New Recorded Action Event. -
//      03. Create New Condition Action Event. -
//      04. Evaluate Actions Nesting Event (DRAG_EVENT). -
//      05. Update Interaction Actions Props Event. -
//      06. Update Condition Actions Options Event (Includes Adding Operator). -
//      07. Delete Action(s) Event.
//      08. Database Events.
//          - 01. Create Workflow Table.
//          - 02. Insert Action To Workflow Table.
//          - 03. Remove Action(s) from Workflow Table.
//          - 04. Delete Workflow Table.
//      09. Update Active Tab Event. -
//      10. Create New Sheet Action Event. -
//      11. Start Recording.
//      12. Error Events (Within State).
/* ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: */
import { z } from "zod";
import { CombinedActionsSchema } from "./replaceTypes/Actions";
import {
  SelectedOptionSchema,
  SelectedTypeSchema,
} from "./ConditionalsSchema";

export const CreateInteractionActionEventSchema = z.object({
  type: z.literal("CREATE_ACTION"),
  payload: z.object({ actionType: z.string() }),
});

export const CreateRecordedActionEventSchema = z.object({
  type: z.literal("RECORDED_ACTION"),
  payload: z.object({
    actionType: z.union([
      // Interation Types
      z.literal("Visit"),
      z.literal("Click"),
      z.literal("Scroll"),
      z.literal("Keypress"),
      z.literal("Type"),
      z.literal("Hover"),
      z.literal("Select"),
      z.literal("Date"),
      z.literal("Upload"),
      z.literal("Prompts"),
      // TabActionTypes
      z.literal("SelectTab"),
      z.literal("SelectWindow"),
      z.literal("Navigate"),
      z.literal("NewTab"),
      z.literal("NewWindow"),
      z.literal("CloseWindow"),
      z.literal("CloseTab"),
      z.literal("Back"),
      z.literal("Forward"),
    ]),
    props: z.any(),
  }),
});

export const ActionDragEventSchema = z.object({
  type: z.literal("DRAG_EVENT"),
  payload: CombinedActionsSchema,
});

export const UpdateInteractionActionEventSchema = z.object({
  type: z.literal("UPDATE_INTERACTION"),
  payload: z.object({
    actionId: z.string(),
    props: z.any(),
  }),
});

export const UpdateConditionActionEventSchema = z.object({
  type: z.literal("UPDATE_CONDITION"),
  payload: z.union([
    z.object({
      actionId: z.string(),
      index: z.number().int(),
      selection: z.object({
        selectedOption: SelectedOptionSchema,
        selectedType: SelectedTypeSchema,
        value: z.string(),
      }),
    }),
    z.object({
      actionId: z.string(),
      index: z.number().int(),
      checkValue: z.string(),
    }),
  ]),
});

export const AddOperatorEventSchema = z.object({
  type: z.literal("ADD_OPERATOR"),
  payload: z.object({
    actionId: z.string(),
    selection: z.union([z.literal("AND"), z.literal("OR")]),
  }),
});

export const UpdateActiveTabEventSchema = z.object({
  type: z.literal("UPDATE_ACTIVE_TAB"),
  payload: z.object({ newTabInfo: z.any() }),
});

export const ActionEventWithoutPayloadSchema = z.object({
  type: z.union([
    z.literal("CREATE_SHEET"),
    z.literal("START_RECORD"),
    z.literal("STOP_RECORD"),
    z.literal("ERROR"),
  ]),
});

export const UpdateTabActionEventSchema = z.object({
  type: z.literal("UPDATE_TAB"),
  payload: z.object({
    action: z.any(),
  }),
});

export const DatabaseEventSchema = z.object({
  type: z.union([
    z.literal("CREATE_WORKFLOW"),
    z.literal("READ_WORKFLOW"),
    z.literal("UPDATE_WORKFLOW"),
    z.literal("DELETE_WORKFLOW"),
  ]),
});

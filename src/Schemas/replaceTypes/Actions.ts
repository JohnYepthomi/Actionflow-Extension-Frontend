import { z } from "zod";
import {
  AnchorActionSchema,
  AttributeActionSchema,
  ClickActionSchema,
  CodeActionSchema,
  DateActionSchema,
  HoverActionSchema,
  IntActionSchema,
  KeypressActionSchema,
  ListActionSchema,
  PromptsActionSchema,
  ScrollActionSchema,
  SelectActionSchema,
  TextActionSchema,
  TypeActionSchema,
  URLActionSchema,
  UploadActionSchema,
  SharedInteractionsPropsSchema,
} from "../InteractionsSchema";
import {
  TabBackActionSchema,
  TabCloseTabActionSchema,
  TabCloseWindowActionSchema,
  TabForwardActionSchema,
  TabNavigateActionSchema,
  TabNewTabActionSchema,
  TabNewWindowActionSchema,
  TabSelectActionSchema,
  TabSelectWindowActionSchema,
  TabsActionSchema,
} from "../TabsSchema";
import {
  ConditionActionSchema,
  BarrierActionSchema,
  IfActionSchema,
  WhileActionSchema,
  ElseActionSchema,
  EndActionSchema,
  BreakActionSchema,
  GeneralConditionSchema,
  OperatorConditionSchema,
} from "../ConditionalsSchema";

/*  APPLAND TYPES */
export type TCommonProps = z.infer<typeof SharedInteractionsPropsSchema>;
export type TComposeStorageKey = "composeData";
export type TIntAction = z.infer<typeof IntActionSchema>;
export type TTabsAction = z.infer<typeof TabsActionSchema>;
export type TConditionAction = z.infer<typeof ConditionActionSchema>;
export type TBarrierAction = z.infer<typeof BarrierActionSchema>;
export type TGeneralCondition = z.infer<typeof GeneralConditionSchema>;
export type TOperatorCondition = z.infer<typeof OperatorConditionSchema>;
export type TConditions = TGeneralCondition | TOperatorCondition;
export type TSheetAction = z.infer<typeof SheetActionSchema>;
export type THeaderInfoActions =
  | TResolveAction<"Click">
  | TResolveAction<"Type">
  | TResolveAction<"Anchor">
  | TResolveAction<"Attribute">
  | TResolveAction<"Text">
  | TResolveAction<"URL">
  | TResolveAction<"Select">
  | TResolveAction<"NewTab">
  | TResolveAction<"SelectTab">
  | TResolveAction<"SelectWindow">
  | TResolveAction<"CloseWindow">
  | TResolveAction<"Navigate">;

export type TAction =
  | TIntAction
  | TTabsAction
  | TConditionAction
  | TBarrierAction
  | TSheetAction;

export const SheetActionTypeSchema = z.literal("Sheet");
export const SheetActionSchema = z.object({
  id: z.string(),
  actionType: z.literal("Sheet"),
  props: z.any(),
  nestingLevel: z.number(),
});

export const CombinedActionsSchema = z
  .union([
    IntActionSchema,
    TabsActionSchema,
    ConditionActionSchema,
    SheetActionSchema,
  ])
  .array();

/* RESOLVE ANY SPECIFIC ACTIONS */
export type TResolveAction<T> =
  // ------------------------- INTERACTIONS -------------------------
  T extends "Click"
    ? z.infer<typeof ClickActionSchema>
    : T extends "Type"
    ? z.infer<typeof TypeActionSchema>
    : T extends "Keypress"
    ? z.infer<typeof KeypressActionSchema>
    : T extends "Hover"
    ? z.infer<typeof HoverActionSchema>
    : T extends "Code"
    ? z.infer<typeof CodeActionSchema>
    : T extends "Prompts"
    ? z.infer<typeof PromptsActionSchema>
    : T extends "Date"
    ? z.infer<typeof DateActionSchema>
    : T extends "Upload"
    ? z.infer<typeof UploadActionSchema>
    : T extends "Scroll"
    ? z.infer<typeof ScrollActionSchema>
    : T extends "List"
    ? z.infer<typeof ListActionSchema>
    : T extends "Text"
    ? z.infer<typeof TextActionSchema>
    : T extends "Attribute"
    ? z.infer<typeof AttributeActionSchema>
    : T extends "Anchor"
    ? z.infer<typeof AnchorActionSchema>
    : T extends "URL"
    ? z.infer<typeof URLActionSchema>
    : T extends "Select"
    ? z.infer<typeof SelectActionSchema>
    : // ------------------------- TABS -------------------------
    T extends "SelectTab"
    ? z.infer<typeof TabSelectActionSchema>
    : T extends "SelectWindow"
    ? z.infer<typeof TabSelectWindowActionSchema>
    : T extends "Navigate"
    ? z.infer<typeof TabNavigateActionSchema>
    : T extends "NewTab"
    ? z.infer<typeof TabNewTabActionSchema>
    : T extends "NewWindow"
    ? z.infer<typeof TabNewWindowActionSchema>
    : T extends "CloseWindow"
    ? z.infer<typeof TabCloseWindowActionSchema>
    : T extends "CloseTab"
    ? z.infer<typeof TabCloseTabActionSchema>
    : T extends "Back"
    ? z.infer<typeof TabBackActionSchema>
    : T extends "Forward"
    ? z.infer<typeof TabForwardActionSchema>
    : // -------------------- CONDITION -------------------------
    T extends "IF"
    ? z.infer<typeof IfActionSchema>
    : T extends "WHILE"
    ? z.infer<typeof WhileActionSchema>
    : T extends "ELSE"
    ? z.infer<typeof ElseActionSchema>
    : T extends "END"
    ? z.infer<typeof EndActionSchema>
    : T extends "BREAK"
    ? z.infer<typeof BreakActionSchema>
    : // --------------------- OPERTOR ---------------------------
    T extends "Operator"
    ? z.infer<typeof OperatorConditionSchema>
    : never;

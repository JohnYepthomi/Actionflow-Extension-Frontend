import { IntAction } from "./Interaction Actions";
import { ConditionalAction, CondEndAction } from "./Conditional Actions";
import { TabAction } from "./Tab Actions";
import { SheetAction } from "./Sheet Action";

export type TAction = IntAction | ConditionalAction | TabAction | CondEndAction | SheetAction;

export type TRecordableActions =
  | "Click"
  | "Scroll"
  | "Keypress"
  | "Type"
  | "Hover"
  | "Select"
  | "SelectTab"
  | "SelectWindow"
  | "Navigate"
  | "NewTab"
  | "NewWindow"
  | "CloseWindow"
  | "CloseTab"
  | "Back"
  | "Forward";

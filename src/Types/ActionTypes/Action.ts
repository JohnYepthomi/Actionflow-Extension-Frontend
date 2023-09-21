import {
  IntAction,
  TAttributeAction,
  TClickAction,
  TAnchorAction,
  TSelectAction,
  TTextAction,
  TTypeAction,
  TURLAction,
} from "./Interaction Actions";
import { ConditionalAction, CondEndAction } from "./Conditional Actions";
import { TabAction, TabActionTypes } from "./Tab Actions";
import { SheetAction } from "./Sheet Action";

export type TAction =
  | IntAction
  | ConditionalAction
  | TabAction
  | CondEndAction
  | SheetAction;

export type THeaderInfoActions =
  | TClickAction
  | TTypeAction
  | TAnchorAction
  | TAttributeAction
  | TTextAction
  | TURLAction
  | TSelectAction;

export type TRecordableActions =
  | "Visit"
  | "Click"
  | "Scroll"
  | "Keypress"
  | "Type"
  | "Hover"
  | "Select"
  | "Date"
  | "Upload"
  | "Prompts"
  | TabActionTypes;

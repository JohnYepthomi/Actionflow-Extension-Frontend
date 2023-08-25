import type { TAction } from "../ActionTypes/Action";
import { IntActionTypes } from "../ActionTypes/Interaction Actions";

export type TEvtWithProps =
  | { type: "ADD_CONDITION_OPERATOR"; actionId: string; selection: string }
  | { type: "DRAG_EVENT"; payload: { dragInfo: TAction[] } }
  | {
      type: "INTERACTION" | "CONDITIONALS";
      item: string;
    }
  | {
      type: "UPDATE_INTERACTION";
      props: any;
      actionId: string;
      propType: IntActionTypes | "Common"; // "Common" literal as an exception where we want to update Action Props and common prop is not part of 'type IntActionTypes' but its is a part of Action Props
    }
  | { type: "UPDATE_ACTION_FROM_FRAME"; actions: TAction[] }
  | {
      type: "UPDATE_CONDITION";
      payload:
        | {
            actionId: string;
            index: number;
            selection: {
              value: string;
              conditionType: string;
              selectedOption: string;
            };
          }
        | { actionId: string; index: number; checkValue: string };
    };

export type Tidle = {
  type:
    | "TAB_ACTIONS_UPDATE"
    | "UPDATE_ACTIVE_TAB"
    | "START_RECORD"
    | "CREATE_TABLE"
    | "INSERT_TO_DB"
    | "CLEAR_WORKFLOW"
    | "NEW_SHEET";
};

export type TrestoreEvt = { type: "RESTORE_ACTIONS" };

export type TrecordingEvt = {
  type:
    | "RECORDED_ACTION"
    | "STOP_RECORDING"
    | "ERROR"
    | "UPDATE_RECORDED_ACTION"
    | "STOP_RECORD";
};

export type TAppEvts = Tidle | TrecordingEvt | TrestoreEvt | TEvtWithProps;

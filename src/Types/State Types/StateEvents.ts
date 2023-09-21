import type { TAction, TRecordableActions } from "../ActionTypes/Action";
import { IntActionTypes } from "../ActionTypes/Interaction Actions";

export type TEvtsWithProps =
  | { type: "ADD_CONDITION_OPERATOR"; actionId: string; selection: string }
  | { type: "DRAG_EVENT"; payload: { dragInfo: TAction[] } }
  | {
      type: "INTERACTION" | "CONDITIONALS" | "TAB_ACTIONS";
      item: { name: string; svg: any };
    }
  | {
      type: "UPDATE_INTERACTION";
      props: any;
      actionId: string;
      // propType: IntActionTypes | "Common"; // "Common" literal as an exception where we want to update Action Props and common prop is not part of 'type IntActionTypes' but its is a part of Action Props
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
    }
  | {
      type: "UPDATE_ACTIVE_TAB";
      newTabInfo: any;
    }
  | {
      type: "TAB_ACTIONS_UPDATE";
      updated_action: any;
    };

export type TIdleEvts = {
  type:
    | "START_RECORD"
    | "CREATE_TABLE"
    | "INSERT_TO_DB"
    | "CLEAR_WORKFLOW"
    | "NEW_SHEET";
};

export type TRestoreEvt = { type: "RESTORE_ACTIONS" };

export type TRecordingEvtsWithProps = {
  type: "RECORDED_ACTION" | "ERROR" | "UPDATE_RECORDED_ACTION";
  actionType: string;
  payload: {
    actionType: TRecordableActions;
    props: any;
  };
};

export type TRecordingEvts = {
  type: "STOP_RECORD";
};

export type TAppEvts =
  | TIdleEvts
  | TRecordingEvtsWithProps
  | TRecordingEvts
  | TRestoreEvt
  | TEvtsWithProps;

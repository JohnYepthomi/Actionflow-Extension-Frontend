import { Interaction, Conditionals, TabActions } from "..";
import { TAction } from "../../AppState/types";

const INT_ACTIONS = [
  "Click",
  "Scroll",
  "Keypress",
  "Type",
  "Hover",
  "Select",
  "Date",
  "Upload",
  "Code",
  "Prompts",
];
const COND_ACTIONS = ["IF", "WHILE", "END", "ELSE", "BREAK"];

const TAB_ACTIONS = ["Navigate", "SelectTab", "NewTab", "CloseTab"]; // "NewWindow" and "SelectWindow" doesn't have any props  only action headers should be shown

function ActionDetails({
  action,
  localActions,
  dispatch,
  current,
}: {
  action: TAction;
  localActions: TAction[];
  dispatch: any;
  current: any;
}) {
  // Filter out Actions that doesn't have/require any Details to display
  if (
    INT_ACTIONS.includes(action.actionType) &&
    COND_ACTIONS.includes(action.actionType) &&
    TAB_ACTIONS.includes(action.actionType)
  )
    return;

  return (
    <div className="action-details flex-column p-2">
      {INT_ACTIONS.includes(action.actionType) && (
        <Interaction
          action={action}
          actions={localActions}
          current={current}
          dispatch={dispatch}
        />
      )}

      {COND_ACTIONS.includes(action.actionType) && (
        <Conditionals
          conditionType="IF"
          actions={localActions}
          actionId={action.id}
          dispatch={dispatch}
        />
      )}

      {TAB_ACTIONS.includes(action.actionType) && (
        <TabActions action={action} dispatch={dispatch} />
      )}
    </div>
  );
}

export default ActionDetails;

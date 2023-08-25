import { Interaction, Conditionals, TabActions } from "..";
import { TAction } from "../../Types/ActionTypes/Action";
import Sheet from "../Sheet";

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
  "List",
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
  // Actions that have Details to display
  if ("props" in action || "conditions" in action || "tabId" in action)
    return (
      <div className="action-details flex-column p-2" data-show-details="false">
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
            action={action}
            dispatch={dispatch}
          />
        )}

        {TAB_ACTIONS.includes(action.actionType) && (
          <TabActions action={action} dispatch={dispatch} />
        )}

        {action.actionType === "Sheet" && <Sheet />}
      </div>
    );
}

export default ActionDetails;

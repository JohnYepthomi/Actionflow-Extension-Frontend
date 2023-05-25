import {
  Interaction,
  Conditionals,
} from "../../components";

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

function ActionDetails({action, localActions, dispatch}){
  return (
    <div className="action-details flex-column p-2">
      {
        INT_ACTIONS.includes(action.actionType) && (
        <Interaction
          actionName={action.actionType}
          actionProps={action.props}
        />
      )}

      {
        COND_ACTIONS.includes(
        action.actionType
      ) && (
        <Conditionals
          conditionType="IF"
          actions={localActions}
          actionId={action.id}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}

export default ActionDetails;
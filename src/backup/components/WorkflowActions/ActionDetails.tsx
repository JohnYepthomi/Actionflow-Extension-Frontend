import Interaction from "../Interaction";
import Conditionals from "../Conditionals";
import TabActions from "../TabActions";
import { TAction } from "../../Schemas/replaceTypes/Actions";
import Sheet from "../Sheet";
import React from 'react';

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
  "Text",
  "Attribute",
  "Anchor",
  "URL",
];
const COND_ACTIONS = ["IF", "WHILE", "END", "ELSE", "BREAK"];

const TAB_ACTIONS = ["Navigate", "SelectTab", "NewTab", "CloseTab"]; // "NewWindow" and "SelectWindow" doesn't have any props  only action headers should be shown

function ActionDetails({
  action,
  localActions,
  dispatch,
  current,
  service
}: {
  action: any;
  localActions: TAction[];
  dispatch: any;
  current: any;
  service: any;
}) {
  console.log("====rendered==== ACTION DETAILS COMPONENT   actionType: ", action.actionType);

  const renderActionDetails = React.useCallback(() => {
      return (
          <div className="action-details flex-column p-2" data-show-details="false">
              {INT_ACTIONS.includes(action.actionType) && (<Interaction action={action} actions={localActions} current={current} dispatch={dispatch}/>)}

              {COND_ACTIONS.includes(action.actionType) && (<Conditionals action={action} current={current} dispatch={dispatch} service={service}/>)}

              {TAB_ACTIONS.includes(action.actionType) && (<TabActions action={action} dispatch={dispatch}/>)}

              {action.actionType === "Sheet" && <Sheet />}
          </div>
      );
  },[action])

  // Actions that have Details to display
  if ("props" in action || "conditions" in action || "tabId" in action){
    return renderActionDetails();
  }else{
    return <></>;
  }
}

export default ActionDetails;

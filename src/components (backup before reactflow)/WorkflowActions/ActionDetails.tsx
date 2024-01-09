import Interaction from "../Interaction";
import Conditionals from "../Conditionals";
import TabActions from "../TabActions";
import { TAction } from "../../Schemas/replaceTypes/Actions";
import Sheet from "../Sheet";
import { useCallback } from "react";
import { Box, VStack } from "@chakra-ui/react";

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
  service,
}: {
  action: any;
  localActions: TAction[];
  dispatch: any;
  current: any;
  service: any;
}) {
  const renderActionDetails = useCallback(() => {
    return (
      <VStack
        w="100%"
        backgroundColor="rgba(50,50,50,0.6)"
        border="1px solid rgba(75,75,75,0.5)"
        borderTop="none"
        borderRadius="0px 0px 3px 3px"
        sx={{
          padding: 5,
        }}
      >
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
            action={action}
            current={current}
            dispatch={dispatch}
            service={service}
          />
        )}

        {TAB_ACTIONS.includes(action.actionType) && (
          <TabActions action={action} dispatch={dispatch} />
        )}

        {action.actionType === "Sheet" && <Sheet />}
      </VStack>
    );
  }, [current, action]);

  // Actions that have Details to display
  if ("props" in action || "conditions" in action || "tabId" in action) {
    return renderActionDetails();
  } else {
    return <></>;
  }
}

export default ActionDetails;

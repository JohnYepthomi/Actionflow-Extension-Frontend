import {
  TAction,
  THeaderInfoActions,
} from "../../Schemas/replaceTypes/Actions";
import { InteractionDefinitions } from "../../ActionsDefinitions/definitions";
import { useEffect, useCallback } from "react";
import {
  Box,
  HStack,
  VStack,
  Center,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { TiDelete } from "react-icons/ti";
import ActionIcon from './ActionIcon'

const header_info_style = {
  alignSelf: "flex-start",
  width: "200px",
  pointerEvents: "none",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflowX: "hidden",
  color: "gray",
  // paddingLeft: "20px",
};

function HeaderInfo<T extends THeaderInfoActions>({ action }: { action: T }) {
  if (
    action.actionType === "Text" ||
    action.actionType === "Anchor" ||
    action.actionType === "Attribute" ||
    action.actionType === "URL"
  )
    return (
      <Box fontSize={["0.65rem", "0.75rem"]} sx={header_info_style}>
        {action.props.value}
      </Box>
    );
  else if (
    (action.actionType === "Click" || action.actionType == "Select") &&
    action.props.Description !== ""
  )
    return (
      <Box fontSize={["0.65rem", "0.75rem"]} sx={header_info_style}>
        {action.props.Description}
      </Box>
    );
  else if (action.actionType === "Type" && action.props.Text !== "") {
    return (
      <Box fontSize={["0.65rem", "0.75rem"]} sx={header_info_style}>
        {action.props.Text}
      </Box>
    );
  } else if (
    ["NewTab", "SelectTab", "SelectWindow", "CloseTab", "Navigate"].includes(
      action.actionType
    ) &&
    "url" in action.props &&
    action.props.url !== ""
  ) {
    return (
      <Box fontSize={["0.65rem", "0.75rem"]} sx={header_info_style}>
        {action.props.url}
      </Box>
    );
  }

  return <></>;
}

export default function ActionHeader({
  isDragging,
  isDragSelect,
  isFocused,
  action,
  current,
  dispatch,
}: {
  isDragging: boolean;
  isDragSelect: boolean;
  isFocused: boolean;
  action: TAction;
  current: any;
  dispatch: any;
}) {

  const renderActionHeader = useCallback(() => {
    return (
      <HStack
        w="300px" //"100%"
        h="50px"
        backgroundColor={
          isDragging || isDragSelect
            ? "rgb(50,145,20)" 
            : current?.context?.currentActionTickerId === action.id
              ? "green"
              : isFocused 
                ? "teal"
                : "rgba(45,45,45)"
        }
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          ":&focus": {
            backgroundColor: "skyblue"
          }
        }}
        boxShadow={"md"}
        border="1px solid rgb(95,95,95)"
        borderRadius="5px 0px 0px 5px"
        onClick={(e) => {
          // e.stopPropagation();
          // setClickedAction((state) => (state === action.id ? "" : action.id))
        }}
        py={["Sheet", "Code", "List", "IF", "END", "BREAK"].includes(action.actionType) ? 2 : 1}
      >
        <HStack gap={5} alignItems="center" px={2} w="100%" h="100%">
          <ActionIcon actionName={action.actionType} />

          <VStack gap={0} alignItems="flex-start" w="100%">
            <HStack>
              <Box fontWeight="bold" color="white" sx={{fontSize: "1.2rem !important"}}>{action.actionType}</Box>

              {"recorded" in action && action.recorded && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  fill="red"
                  className="bi bi-record2"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1A5 5 0 1 0 8 3a5 5 0 0 0 0 10z" />
                  <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                </svg>
              )}
            </HStack>

            <HeaderInfo action={action} />
          </VStack>

        </HStack>

{/*        <IconButton
          aria-label="Delete Action"
          icon={<TiDelete />}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: "DELETE_ACTION", actionId: action.id });
          }}
          size="xs"
          color="rgb(60,60,60)"
          _hover={{ color: "red" }}
          variant="ghost"
          fontSize="1.3rem"
        />*/}
      </HStack>
    );
  }, [
    isDragging,
    isDragSelect,
    isFocused,
    action,
    dispatch,
    current?.context?.currentActionTickerId,
  ]);

  return renderActionHeader();
}

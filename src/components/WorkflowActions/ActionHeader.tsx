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

const header_info_style = {
  alignSelf: "flex-start",
  width: "200px",
  pointerEvents: "none",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflowX: "hidden",
  color: "skyblue",
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
  action,
  current,
  dispatch,
}: {
  action: any;
  current: any;
  dispatch: any;
}) {

  const renderActionHeader = useCallback(() => {
    return (
      <HStack
        w="250px" //"100%"
        backgroundColor={
          current?.context?.currentActionTickerId === action.id
            ? "green"
            : "#422b6f"
        }
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
        boxShadow={"md"}
        border="1px solid rgba(55,55,55)"
        borderRadius="5px"
        onClick={(e) => {
          // e.stopPropagation();
          // setClickedAction((state) => (state === action.id ? "" : action.id))
        }}
        px={2}
        py={["Sheet", "Code", "List", "IF", "END", "BREAK"].includes(action.actionType) ? 2 : 1}
      >
        <VStack w="100%" gap={0}>
          <HStack gap={1} alignSelf="flex-start">
             <Center>
              {InteractionDefinitions.find(
                (d) => d.name === action.actionType
              )?.svg()}
            </Center>

            <Box fontSize={["sm", "md"]} color="white">{action.actionType}</Box>

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

        <IconButton
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
        />
      </HStack>
    );
  }, [
    action,
    dispatch,
    current?.context?.currentActionTickerId,
  ]);

  return renderActionHeader();
}

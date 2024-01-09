import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Button,
  Stack,
  IconButton,
  Divider,
  CloseButton
} from "@chakra-ui/react";
import { InteractionDefinitions } from "../ActionsDefinitions/definitions";
import React, {
  useContext,
  useState,
  memo,
  ReactNode,
  useCallback,
} from "react";
import { TAppEvents } from "../Schemas/replaceTypes/StateEvents";
import { VStack, Box, HStack } from "@chakra-ui/react";
import ActionIcon from "./WorkflowActions/ActionIcon";
import { motion } from "framer-motion";

// Global State
import { GlobalStateContext } from "../AppState/GlobalState";
import { useSelector } from "@xstate/react";

type TMenuCategory = {
  title: String;
  actionDefintions: any; // needs narrowing
  dispatch: any;
};

function MenuCategory({
  title,
  actionDefintions,
  dispatch,
  current,
}: TMenuCategory) {


  return (
    <>
      <Box
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 2222
        }}
        color="rgb(139, 131, 167)"
        fontSize="0.75rem"
        fontWeight="bold"
        backgroundColor="rgb(35,35,35)"
        w="100%"
        h="100%"
        p={1}
      >{title}</Box>

      <VStack
        w="100%"
        h="100%"
      >
        {actionDefintions &&
          actionDefintions.map(
            (item: { name: string; svg: () => ReactNode }, index: number) => {
              return (
                <Button
                  borderRadius={3}
                  variant="solid"
                  backgroundColor="#282b31"
                  w="130px"
                  h={25}
                  onClick={(e) => {
                    e.preventDefault();

                    dispatch({
                      type: "CREATE_ACTION",
                      payload: {
                        actionType: item.name,
                      },
                    } satisfies TAppEvents);
                  }}
                >
                  <HStack
                    w="100%"
                    h="100%"
                    fontSize="0.7rem"
                    key={index}
                    alignItems="center"
                    justifyContent="space-between"
                    p={1}
                    gap={3}
                  >
                    <ActionIcon
                      actionName={item.name}
                      iconSize={5}
                      style={{
                        border: 'none',
                        color: 'lightgray'
                      }}
                    />
                    <Box
                      color="lightgray"
                      w="100%"
                      sx={{display: 'flex'}}
                    >
                      {item.name}
                    </Box>
                  </HStack>
                </Button>
              );
            }
          )}
      </VStack>
    </>
  );
}

const Categories = [
  {
    categoryName: "Common Actions",
    defs: InteractionDefinitions.filter(
      (a) =>
        !["IF", "END", "Navigate", "NewTab", "SelectTab", "CloseTab"].includes(
          a.name
        )
    ),
  },
  {
    categoryName: "Spreadsheets",
    defs: [{ name: "Sheet", svg: () => "sheet svg" }],
  },
  {
    categoryName: "Flow Controls",
    defs: InteractionDefinitions.filter((a) =>
      ["IF", "WHILE", "END", "ELSE"].includes(a.name)
    ),
  },
  {
    categoryName: "Tab Actions",
    defs: InteractionDefinitions.filter((a) =>
      ["Navigate", "NewTab", "SelectTab", "CloseTab"].includes(a.name)
    ),
  },
];

function ActionMenu({ dispatch }) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  // const globalServices = useContext(GlobalStateContext);
  // const { send } = globalServices.appService;

  const renderActionMenu = useCallback(() => {
    console.log("ActionMenu Rendered");
      return (
        <VStack
          w="100%"
          h="fit-content"
          gap={2}
          pb={2}
        >
          {Categories.map((cat, index) => {

            // if(index == 0)
            return (
              <>
                <MenuCategory
                  title={cat.categoryName}
                  actionDefintions={cat.defs}
                  dispatch={dispatch}
                />

                { /* index !== (Categories.length - 1) && <Divider /> */}
              </>
            );
          })}
        </VStack>
      );
  }, [dispatch]);

  return renderActionMenu();
}

export default memo(ActionMenu);
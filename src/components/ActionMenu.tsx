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
    <Box w="100%">
      <Box>{title}</Box>
      <Box>
        {actionDefintions &&
          actionDefintions.map(
            (item: { name: string; svg: () => ReactNode }, index: number) => {
              return (
                <Button
                  w={20}
                  m={1}
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
                  <HStack fontSize="0.7rem" key={index}>
                    {item.svg()}
                    <Box>{item.name}</Box>
                  </HStack>
                </Button>
              );
            }
          )}
      </Box>
    </Box>
  );
}

const Categories = [
  {
    categoryName: "Page Interactions",
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
    categoryName: "Conditinals",
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

export default function ActionMenu({ dispatch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  // const globalServices = useContext(GlobalStateContext);
  // const { send } = globalServices.appService;

  const renderActionMenu = useCallback(() => {
    console.log("ActionMenu Rendered");
    return (
      <>
        <Button
          ref={btnRef}
          colorScheme="gray"
          // variant="outline"
          onClick={onOpen}
        >
          Pick Action
        </Button>

        <Drawer
          isOpen={isOpen}
          placement="right"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader textAlign="center">Actions</DrawerHeader>

            <DrawerBody>
              <VStack gap={3} alignItems="center" justifyContent="center">
                {Categories.map((cat) => (
                  <MenuCategory
                    title={cat.categoryName}
                    actionDefintions={cat.defs}
                    dispatch={dispatch}
                  />
                ))}
              </VStack>
            </DrawerBody>

            <DrawerFooter>
              {/* <Button variant="outline" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue">Save</Button> */}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }, [dispatch, isOpen, onOpen, onClose]);

  return renderActionMenu();
}

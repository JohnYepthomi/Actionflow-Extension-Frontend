import GlobeIcon from "../assets/globe";
import { Center, Box, HStack, Text } from "@chakra-ui/react";

type ActiveTabParams = { current: any };
export default function ActiveTab({ current }: ActiveTabParams) {
  const { activeTab } = current.context;

  if (activeTab)
    return (
      <Center>
        <HStack
          w="70%"
          alignItems="center"
          mt={2}
          borderRadius={5}
          border="1px solid rgb(70,70,70)"
          overflowX="hidden"
        >
          <Box
            px={2}
            py={1}
            fontSize="0.75rem"
            fontWeight="bold"
            whiteSpace="nowrap"
            borderRight="1px solid rgb(70,70,70)"
            backgroundColor="rgb(45,45,45)"
          >
            Active Tab
          </Box>
          <HStack>
            {activeTab?.icon ? (
              <img
                src={activeTab.icon}
                alt="Active Tab favicon"
                width="15px"
                height="15px"
              />
            ) : (
              <Box>
                <GlobeIcon />
              </Box>
            )}
            <Text noOfLines={1} fontSize="0.85rem">
              {activeTab?.title ? activeTab.title : "No Active Tab"}
            </Text>
          </HStack>
        </HStack>
      </Center>
    );
  else return <></>;
}

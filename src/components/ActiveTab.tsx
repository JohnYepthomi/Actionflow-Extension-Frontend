import GlobeIcon from "../assets/globe";
import { Center, Box, HStack, Text, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";

type ActiveTabParams = { current: any };
export default function ActiveTab({ current }: ActiveTabParams) {
  // const { activeTab } = current.context;
  const activeTab = {
    title: "Facebook"
  }

  if (activeTab)
    return (
      <HStack
        mt={3}
        alignItems="center"
        justifyContent="center"
        borderRadius={3}
        overflowX="hidden"
        gap={0}
        px={2}
        border="1px solid rgb(45,45,45)"
      > 
        <Center
          p={1}
        >
          {
            activeTab?.icon 
              ? <img
                  src={activeTab.icon}
                  alt="Active Tab favicon"
                  width="15px"
                  height="15px"
                />
             : <GlobeIcon />
          }
        </Center>

        <Box
          p={1}
          maxW="150px"
        >
          <Text
            noOfLines={1}
            fontSize="xs"
            as="b"
            color="lightgray"
          >
            {activeTab?.title ? activeTab.title : "No Active Tab"}
          </Text>
        </Box>
      </HStack>
    );
  else return <></>;
}

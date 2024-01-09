import { TTabsAction } from "../Schemas/replaceTypes/Actions";
import { Box, HStack, VStack, Input } from "@chakra-ui/react";
import { useState } from "react";

type TabActionParams = {
  action: TTabsAction;
  dispatch: any;
};
export default function TabActions({ action, dispatch }: TabActionParams) {
  const [url, setUrl] = useState(action.props.url);
  return (
    <VStack alignItems="flex-start" w="100%">
      <Box className="fs-md">URL</Box>
      <Input
        id={action.props.url}
        placeholder="url"
        value={url}
        onChange={(e) => {
          setUrl();
        }}
      />
    </VStack>
  );
}

function debounce(fn: any, ms: any) {
  let timer: number | undefined;
  return function () {
    clearTimeout(timer);
    const context = debounce;
    const args = arguments;

    timer = setTimeout(function () {
      timer = undefined;
      fn.apply(context, args);
    }, ms);
  };
}

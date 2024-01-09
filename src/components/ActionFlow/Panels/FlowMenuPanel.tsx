import { Panel } from "reactflow";
import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { Box, ButtonGroup, IconButton, VStack } from "@chakra-ui/react";
import { CiFolderOn } from "react-icons/ci";
import { VscGitPullRequestCreate } from "react-icons/vsc";
import Explorer from "./ExplorerPanel";
import ActionMenu from "../../ActionMenu";
import ActionDetailsPanel from "./ActionDetailsPanel";
import WorkflowInfo from "../../../../../components/WorkflowInfo";

const selectedColor = "rgb(70,70,120)";

function FlowMenuPanel({
  position,
  nodes,
  current,
  dispatch,
  workflowName,
  workflow,
  settingsStore,
}) {
  const [page, setPage] = useState("explorer");
  const focusedNode = useMemo(
    () => nodes?.filter((n) => n.data?.isFocused)[0],
    [nodes]
  );
  const getPageFromStore = useCallback(async () => {
    if(!settingsStore){
      console.warn("settingsStore not initialised");
      return;
    }

    const selectedPage = await settingsStore?.get("selected-page");
    return selectedPage.page;
  },[]);

  const updatePageToStore = useCallback(async ( page ) => {
    if (settingsStore && typeof page === 'string') {
      await settingsStore.set("selected-page", { page });
      await settingsStore.save();
    } 
  },[settingsStore])

  useEffect(() => {
    getPageFromStore().then(newPage => {
      if(newPage) setPage(newPage);
    });
  },[])

  const renderPanel = useCallback(() => {
    return (
      <Panel position={position ?? "top-right"}>
        <VStack
          w={180}
          h="100%"
          border="1px solid rgb(55,55,55)"
          borderRadius={5}
          backgroundColor="rgb(25,25,25)"
          gap={0}
        >
          {workflow && workflowName && (
            <WorkflowInfo
              workflowName={workflowName}
              flowActions={workflow}
              dispatchWorkflow={dispatch}
            />
          )}

          <ButtonGroup w="100%" h="100%" size="xs" isAttached variant="outline">
            <IconButton
              w="100%"
              icon={<VscGitPullRequestCreate />}
              onClick={() => {
                setPage("actions-menu");
                updatePageToStore("actions-menu");
              }}
              borderRadius="0px 0px 3px 0px"
              borderLeft="none"
              borderRight="none"
              borderBottom="none"
              backgroundColor={page === "actions-menu" && selectedColor}
            />

            <IconButton
              w="100%"
              icon={<CiFolderOn />}
              onClick={() => {
                setPage("explorer");
                updatePageToStore("explorer");
              }}
              borderRight="none"
              borderBottom="none"
              backgroundColor={page === "explorer" && selectedColor}
            />

            <IconButton
              w="100%"
              icon={<VscGitPullRequestCreate />}
              onClick={() => {
                setPage("action-details");
                updatePageToStore("action-details");
              }}
              borderRight="none"
              borderRadius="0px 0px 0px 3px"
              borderBottom="none"
              backgroundColor={page === "action-details" && selectedColor}
            />
          </ButtonGroup>

          <MenuContent>
            {page === "explorer" && <Explorer />}
            {page === "actions-menu" && <ActionMenu dispatch={dispatch} />}
            {page === "action-details" && (
              <ActionDetailsPanel
                nodes={nodes}
                focusedNode={focusedNode}
                current={current}
                dispatch={dispatch}
              />
            )}
          </MenuContent>
        </VStack>
      </Panel>
    );
  }, [page, position, nodes, dispatch, settingsStore]);

  return renderPanel();
}

function MenuContent({ children }) {
  return (
    <Box
      w="100%"
      h="fit-content"
      maxHeight="60vh"
      overflowY="scroll"
      sx={{
        '::-webkit-scrollbar': {
          display: 'none',
          width: 0,
        }
      }}
    >
      {children}
    </Box>
  );
}

export default memo(FlowMenuPanel);

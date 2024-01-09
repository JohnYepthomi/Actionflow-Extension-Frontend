import { Panel } from 'reactflow';
import { useCallback } from 'react';
import { Box, CloseButton } from "@chakra-ui/react";
import ActionMenu from "../../ActionMenu";
import ActionDetails from "../../WorkflowActions/ActionDetails";

export default function ActionDetailsPanel({ nodes, focusedNode, current, dispatch }){
    const handleClose = useCallback(() => {
        setShowMenu(false);
    },[]);

    if(!focusedNode)
         return;

    return (
        <>
            {
                <Box>
                    <Box
                        borderBottom="1px solid rgb(75,75,75)"
                        color="pink"
                        fontSize="0.8rem"
                        backgroundColor="rgb(25,25,25)"
                        px={3}
                        pt={1}
                        // borderRadius="3px 3px 0px 0px"
                    >
                        {focusedNode.data.action.actionType}
                    </Box>
                    <ActionDetails
                        action={focusedNode.data.action}
                        localActions={nodes.map(n => n.data.action)}
                        current={current}
                        dispatch={dispatch}
                    />
                </Box>
            }
        </>
    );
}

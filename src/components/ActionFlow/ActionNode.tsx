import { useCallback } from "react";
import { motion } from "framer-motion";
import ActionHeader from "../WorkflowActions/ActionHeader";
import type { TNodeData } from "./ActionsView";
import { Handle, Position, useReactFlow } from 'reactflow';
import "./edge.css";
import { useEffect, useRef } from 'react';
import { Box, IconButton } from "@chakra-ui/react";
import { IoMdInformationCircle } from "react-icons/io";

export default function ActionNode({ data, ...props }: { data: TNodeData}){
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
    console.log("ActionNode onChange");
  }, []);
  const { isFocused, isDragging, isDragSelect, index, hideTopHandle, action, current, dispatch } = data;
  const actionType = action.actionType;
  const reactFlowInstance = useReactFlow();
  const isSpecialAction = ["IF"].includes(actionType);
  const sourceStyle = {
    // borderColor: "orange",
    // backgroundColor: "orange",
    // width: 7,
    // height: 7,
    animation: "fade 1s 1",
   };
  const targetStyle = {
    // width: 0,
    // height: 0,
    // borderTop: "7px solid orange",
    // borderLeft: "7px solid transparent",
    // borderRight: "7px solid transparent",
    // borderBottom: "none",
    // backgroundColor: "transparent",
    // borderRadius: 0,
    animation: "fade 1s 1",
  };
  const hideTopHandleStyle = {
    border: 'none',
    backgroundColor: 'transparent'
  };
  const isFirstNode = reactFlowInstance.getNodes().findIndex(n => n.id === props.id) === 0;

  if(!action)
    return (
      <>
        <div>Add New Action</div>
      </>
    );

  //rotate: (isDragging || isDragSelect) ? "-5deg" : "0deg" 
  // whileHover={{ scale: 1.3 }}

  const handleInfoClick = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    reactFlowInstance.setNodes(nds => {
      if(!nds.some(n => n.id === `${props.id}-detail-node`)){
        nds.push({
          id: `${props.id}-detail-node`,
          data: { action, isDetailNode: true },
          type: 'detailsNode',
          position: {
            x: props.xPos + 500,
            y: props.yPos,
          },
        });
      }
      return nds;
    })

    reactFlowInstance.setEdges(eds => {
      if(!eds.some(e => e.id === `e${props.id}-detail-node`)){
        eds.push({
          id: `e${props.id}-detail-node`,
          source: props.id,
          target: `${props.id}-detail-node`,
          animated: true,
          type: 'actionEdge',
          data: {offset: null, isRedEdge: false},
          sourceHandle: 'details-handle',
          style: { stroke: 'skyblue' }
        });
      }

      return eds;
    });

  }, [reactFlowInstance.nodes, reactFlowInstance.edges, data])

  const renderNode = useCallback(() => {
    return (
      <motion.div layout >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            // rotate: (isDragging || isDragSelect) ? "5deg" : "0deg" 
          }}> 
          {/*<Box mr={2}>{props.id}</Box>*/}

          <ActionHeader
            isDragging={isDragging}
            isDragSelect={isDragSelect}
            isFocused={isFocused}
            action={action}
            current={current}
            dispatch={dispatch}
          />

          {/*{ <div style={{position: 'absolute', bottom: 0, right: 0}}>{isFirstNode.toString()}</div>}*/}

          <div className="nodrag">
            <IconButton
              variant='ghost'

              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                height: '100%',
              }}
              icon={<IoMdInformationCircle/>}
              onClick={handleInfoClick}
            />
          </div>
          
          <Handle
            id="top"
            type="target"
            position={Position.Top}
            style={
              isFirstNode
                ? hideTopHandleStyle
                : targetStyle
            }
          />

          { !isDragging && !isDragSelect &&
            <>

              <Handle
                type="source"
                // id={action.id}
                id="bottom"
                position={Position.Bottom}
                style={{ ...sourceStyle }}
              />

              {isSpecialAction && (
                <>
                  <Handle
                    type="source"
                    // id={action.id + actionType}
                    id="bottom"
                    position={Position.Bottom}
                    style={{ ...sourceStyle }}
                  />
                  <Handle
                    type="source"
                    // id={action.id}
                    id="right"
                    position={Position.Right}
                    style={{ ...sourceStyle }}
                  />
                </>
              )}
            </>
          }
        </div>
      </motion.div>
    );
  }, [data, props, isFirstNode]);

  return renderNode();
}

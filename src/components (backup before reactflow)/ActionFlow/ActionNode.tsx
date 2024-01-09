import { useCallback } from "react";
import { motion } from "framer-motion";
import ActionHeader from "../WorkflowActions/ActionHeader";
import type { TNodeData } from "./ActionsView";
import { Handle, Position } from 'reactflow';
import "./edge.css";
import { useEffect, useRef } from 'react';
import {Box} from "@chakra-ui/react";

export default function ActionNode({ data, ...props }: { data: TNodeData}){
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
    console.log("ActionNode onChange");
  }, []);
  const { isFocused, isDragging, isDragSelect, index, hideTopHandle, action, current, dispatch } = data;
  const actionType = action.actionType;
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
  const nodeRef = useRef();

  // console.log("Node Props: ", props);
  
  const isSpecialAction = ["IF"].includes(actionType);

  if(!action)
    return (
      <>
        <div>Add New Action</div>
      </>
    );

  //rotate: (isDragging || isDragSelect) ? "-5deg" : "0deg" 
  // whileHover={{ scale: 1.3 }}

  const renderNode = useCallback(() => {
    return (
      <motion.div layout > 

        <div
          ref={nodeRef}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // rotate: (isDragging || isDragSelect) ? "5deg" : "0deg" 
          }}> 



          <ActionHeader
            isDragging={isDragging}
            isDragSelect={isDragSelect}
            isFocused={isFocused}
            action={action}
            current={current}
            dispatch={dispatch}
          />

{/*          <Box
            className="custom-drag-handle"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: '1px solid rgb(95,95,95)',
              borderTop: '1px solid rgb(95,95,95)',
              borderBottom: '1px solid rgb(95,95,95)',
              borderRadius: '0px 4px 4px 0px',
              backgroundColor: 'rgb(45,45,45)',
              width: 30,
              height: 50
            }}>::</Box>*/}
          
          {/*<div>index: {index}</div>*/}

          <Handle
            // id={action.id}
            id="top"
            type="target"
            position={Position.Top}
            style={{ ...targetStyle }}
          />

          {
            
              <>
                {!isSpecialAction && (
                  <Handle
                    type="source"
                    // id={action.id}
                    id="bottom"
                    position={Position.Bottom}
                    style={{ ...sourceStyle }}
                  />
                )}
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
  }, [data]);

  return renderNode();
}

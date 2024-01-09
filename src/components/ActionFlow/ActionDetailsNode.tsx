import { useCallback } from "react";
import { motion } from "framer-motion";
import ActionDetails from "../WorkflowActions/ActionDetails";
import type { TNodeData } from "./ActionsView";
import { Handle, Position } from 'reactflow';
import "./edge.css";
import { useEffect, useRef } from 'react';
import { Box } from "@chakra-ui/react";

export default function ActionDetailsNode({ data, ...props }: { data: TNodeData}){
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
    console.log("ActionNode onChange");
  }, []);
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
  const { action } = data;

  if(!action)
    return (
      <>
        <div>No Details</div>
      </>
    );

  const renderNode = useCallback(() => {
    return (
      <motion.div layout > 
        <div
          style={{
            // display: 'flex',
            // flexDirection: 'row',
            // alignItems: 'center',
          }}> 
            <Handle
              id="details-handle"
              type="target"
              position={Position.Left}
              style={{ ...targetStyle }}
            />
            <ActionDetails
              action={action}
              localActions={[]}
              current={null}
              dispatch={null}
            />
        </div>
      </motion.div>
    );
  }, [data]);

  return renderNode();
}

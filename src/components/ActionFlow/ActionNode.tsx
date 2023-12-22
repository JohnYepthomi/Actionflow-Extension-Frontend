import { useCallback } from "react";
import { motion } from "framer-motion";
import ActionHeader from "../WorkflowActions/ActionHeader";
import type { TNodeData } from "./ActionsView";
import { Handle, Position } from 'reactflow';
import "./edge.css";

export default function ActionNode({ data, ...props }: { data: TNodeData}){
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
    console.log("ActionNode onChange");
  }, []);
  const { isDragging, isDragSelect, index, hideTopHandle, action, current, dispatch } = data;
  const actionType = action.actionType;
  const sourceStyle = {
    // borderColor: "orange",
    // backgroundColor: "rgb(55,55,55)",
    width: 13,
    height: 13,
    animation: "fade 1s 1",
   };
  const targetStyle = {
    width: 0,
    height: 0,
    borderTop: "5px solid lightgreen",
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderBottom: "none",
    backgroundColor: "transparent",
    borderRadius: 0,
    animation: "fade 1s 1",
  };
  
  const isSpecialAction = ["IF"].includes(actionType);

  if(!action)
    return (
      <>
        <div>Add New Action</div>
      </>
    );

  //rotate: (isDragging || isDragSelect) ? "-5deg" : "0deg" 

  return (
    <motion.div layout whileHover={{ scale: 1.3 }}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', }}> 
        <ActionHeader
          isDragging={isDragging || isDragSelect}
          action={action}
          current={current}
          dispatch={dispatch}
        />
        
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
}

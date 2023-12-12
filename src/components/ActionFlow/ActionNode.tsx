import { useCallback } from "react";
import { motion } from "framer-motion";
import ActionHeader from "../WorkflowActions/ActionHeader";
import type { TNodeData } from "./ActionsView";
import { Handle, Position } from 'reactflow';
import "./edge.css";

export default function ActionNode({ data }: { data: TNodeData}){
  const onChange = useCallback((evt: { target: { value: any } }) => {
    console.log(evt.target.value);
    console.log("ActionNode onChange");
  }, []);
  const { isDragging, index, hideTopHandle, action, current, dispatch } = data;
  const actionType = action.actionType;
  const sourceStyle = {
    borderColor: "orange",
    backgroundColor: "orange", 
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

  return (
    <motion.div layout whileHover={{ scale: 1.3 }}>

      <div style={{ rotate: isDragging ? "-5deg" : "0deg" }}>
        <ActionHeader
          isDragging={isDragging}
          action={action}
          current={current}
          dispatch={dispatch}
        />

        {!isDragging && (
          <>
            { !hideTopHandle && (
              <Handle
                id={action.id}
                type="target"
                position={Position.Top}
                style={{ ...targetStyle }}
              />
            )}

            {!isSpecialAction && (
              <Handle
                type="source"
                id={action.id}
                position={Position.Bottom}
                style={{ ...sourceStyle }}
              />
            )}
            {isSpecialAction && (
              <>
                <Handle
                  type="source"
                  id={action.id + actionType}
                  position={Position.Bottom}
                  style={{ ...sourceStyle }}
                />
                <Handle
                  type="source"
                  id={action.id}
                  position={Position.Right}
                  style={{ ...sourceStyle }}
                />
              </>
            )}
          </>
        )}
      </div>

    </motion.div>
  );
}

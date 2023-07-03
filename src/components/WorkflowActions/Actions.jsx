import { useEffect, useRef, useState } from "react";
import ActionHeader from "./ActionHeader";
import ActionDetails from "./ActionDetails"
import "../../styles/draganddrop.css";

function getAnimationClassNames(index, movedItem, draggedItem) {
  if (movedItem !== index) return "";
  if (movedItem - draggedItem > 0) return "moved-down";
  else return "move-up";
}

const Actions = ({ actions, dispatch }) => {
  const [localActions, setLocalActions] = useState(actions); // local state is required to facilitate drag and drop
  const initialDraggedPos = useRef();
  const movedPos = useRef();
  const draggedPos = useRef();
  const enterPos = useRef();
  const tempMarginLeft = useRef();
  const tempDataActionType = useRef();

  const handleDragStart = (e, index) => {
    console.log("handleDragStart");
    e.dataTransfer.effectAllowed = 'move';
    // e.dataTransfer.setData('text/plain', 'some_dummy_data'); // firefox
    // e.target.style.backgroundColor = "red";
    // e.target.style.opacity = "0.001";

    tempMarginLeft.current = e.target.style.marginLeft;
    e.target.style.marginLeft = "";
    draggedPos.current = index;
    initialDraggedPos.current = index;
  };
  const handleDragEnter = (e, index) => {
    if (enterPos.current) return;
    else enterPos.current = index;

    if (draggedPos.current !== index) {
      const t0 = performance.now();

      let newItems = [...localActions];
      const dragItem = newItems[draggedPos.current];
      newItems.splice(draggedPos.current, 1);
      newItems.splice(index, 0, dragItem);

      movedPos.current = draggedPos.current;
      draggedPos.current = index;

      const t1 = performance.now();
      console.log(`Items Switching took ${t1 - t0} milliseconds.`);

      setLocalActions((state) => newItems);
    }
  };
  const handleDragLeave = (e, index) => {
    enterPos.current = null;
  };
  const handleDragEnd = (e, index) => {
    // e.target.style.opacity = "1";
    // e.target.style.backgroundColor = "#393939";

    e.target.style.marginLeft = tempMarginLeft.current;

    if (initialDraggedPos.current !== draggedPos.current) {
      // setLocalActions((state) => EvauateNesting(state));
      dispatch({type: "DRAG_EVENT", updatedActions: localActions, dragInfo: {initialDraggedPos: initialDraggedPos.current, currentDraggedPos: draggedPos.current }});
    }

    resetRefs();
  };

  useEffect(()=>{
    console.log("Workflow -> Actions -> localActions: ", localActions);
    setLocalActions(state => actions);
  },[actions]);

  function resetRefs(){
    console.log("resetting refs...");
    enterPos.current = null;
    movedPos.current = null;
    draggedPos.current = null;
    initialDraggedPos.current = null;
  }

  return (
    <ul className="workflow-ul" style={{ overflowX: "hidden" }}>
      {
        localActions.map((action, index) => {
          const marginLeft = action.nestingLevel * 35;

          return (
            <li
              key={action.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragLeave={(e) => handleDragLeave(e, index)}
              onDragEnd={(e) => handleDragEnd(e, index)}
              className={getAnimationClassNames(index, movedPos.current, draggedPos.current)}
              style={{ position: "relative", marginLeft }}
            >
              <ActionHeader action={action} />
              <ActionDetails action={action} localActions={localActions} dispatch={dispatch} />
          </li>
        )})
      }
    </ul>
  );
};

export default Actions;



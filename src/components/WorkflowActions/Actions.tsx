import { useEffect, useRef, useState } from "react";
import ActionHeader from "./ActionHeader";
import ActionDetails from "./ActionDetails";
import { motion } from "framer-motion";
import { useAnimationControls } from "framer-motion";
import { TAction } from "../../AppState/types";

function getAnimationClassNames(index, movedItem, draggedItem) {
  if (movedItem !== index) return "";
  if (movedItem - draggedItem > 0) return "moved-down";
  else return "move-up";
}

const isWebkit =
  /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

let itemColor = "";
const transparentImage = new Image();
transparentImage.src =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42AAAAABJRU5ErkJggg==";

type CActionsParams = { actions: TAction[]; dispatch: any; current: any };

const ChromeActions = ({ actions, dispatch, current }: CActionsParams) => {
  const [localActions, setLocalActions] = useState(actions); // local state is required to facilitate drag and drop
  const initialDraggedPos: { current: number } = useRef();
  const movedPos: { current: number } = useRef();
  const draggedPos: { current: number } = useRef();
  const enterPos: { current: number } = useRef();
  const tempMarginLeft: { current: number } = useRef();
  const controls = useAnimationControls();

  // CHROME DRAG EVENTS HANDLERS
  const handleDragStart = (e, index) => {
    console.log("handleDragStart");
    e.dataTransfer.effectAllowed = "move";
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
      dispatch({
        type: "DRAG_EVENT",
        updatedActions: localActions,
        dragInfo: {
          initialDraggedPos: initialDraggedPos.current,
          currentDraggedPos: draggedPos.current,
        },
      });
    }

    resetRefs();
  };

  useEffect(() => {
    controls.start("visible");
  }, [controls, localActions]);

  useEffect(() => {
    // console.log("Workflow -> Actions -> localActions: ", localActions);
    console.log("Actions Component Rerendered");
    setLocalActions((state) => actions);
  }, [actions]);

  function resetRefs() {
    console.log("resetting refs...");
    enterPos.current = null;
    movedPos.current = null;
    draggedPos.current = null;
    initialDraggedPos.current = null;
  }

  const variants = {
    visible: {
      opacity: 1,
      x: 0,
    },
    hidden: {
      opacity: 0,
      x: -15,
    },
  };

  return (
    <AddStyle>
      <ul className="workflow-ul" style={{ overflowX: "hidden" }}>
        {localActions.map((action, index) => {
          const marginLeft = action.nestingLevel * 35;

          return (
            <motion.li
              key={action.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragLeave={(e) => handleDragLeave(e, index)}
              onDragEnd={(e) => handleDragEnd(e, index)}
              className={getAnimationClassNames(
                index,
                movedPos.current,
                draggedPos.current
              )}
              style={{ position: "relative", marginLeft }}
              /* framer */
              initial="hidden"
              variants={variants}
              animate={controls}
              transition={{ duration: 0.3 }}
              // sx={{
              //   "&::before": {
              //     content: '""',
              //     backgroundColor: "red",
              //     position: "absolute",
              //     width: "100%",
              //     height: "100%",
              //     left: 0,
              //     top: 0,
              //     zIndex: 2,
              //     transform: "var(--before-x)"
              //   }
              // }}
            >
              <ActionHeader action={action} animateControl={controls} />
              <ActionDetails
                action={action}
                localActions={localActions}
                dispatch={dispatch}
                current={current}
              />
            </motion.li>
          );
        })}
      </ul>
    </AddStyle>
  );
};

const WebkitActions = ({ actions, dispatch, current }: CActionsParams) => {
  const [localActions, setLocalActions] = useState(actions); // local state is required to facilitate drag and drop
  const initialDraggedPos: { current: number } = useRef();
  const movedPos: { current: number } = useRef();
  const draggedPos: { current: number } = useRef();
  const enterPos: { current: number } = useRef();
  const tempMarginLeft = useRef();
  const controls = useAnimationControls();

  // :::::::::::  WEBKIT Compatble Handlers :::::::::::
  const handleDragStart = (e, index) => {
    console.log("handleDragStart");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setDragImage(transparentImage, 0, 0);
    e.dataTransfer.setData("text/plain", "some_dummy_data"); // webkit
    itemColor = e.target.style.backgroundColor;
    e.target.style.backgroundColor = "#4a4a4a";
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
    e.target.style.backgroundColor = itemColor;
    e.target.style.marginLeft = tempMarginLeft.current;

    if (initialDraggedPos.current !== draggedPos.current) {
      // setLocalActions((state) => EvauateNesting(state));
      dispatch({
        type: "DRAG_EVENT",
        updatedActions: localActions,
        dragInfo: {
          initialDraggedPos: initialDraggedPos.current,
          currentDraggedPos: draggedPos.current,
        },
      });
    }

    resetRefs();
  };

  useEffect(() => {
    // console.log("Workflow -> Actions -> localActions: ", localActions);
    console.log("Actions Component Rerendered");
    setLocalActions((state) => actions);
  }, [actions]);

  function resetRefs() {
    console.log("resetting refs...");
    enterPos.current = null;
    movedPos.current = null;
    draggedPos.current = null;
    initialDraggedPos.current = null;
  }

  return (
    <ul className="workflow-ul" style={{ overflowX: "hidden" }}>
      {localActions.map((action, index) => {
        const marginLeft = action.nestingLevel * 35;

        return (
          <li
            key={action.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={(e) => handleDragLeave(e, index)}
            onDragEnd={(e) => handleDragEnd(e, index)}
            className={getAnimationClassNames(
              index,
              movedPos.current,
              draggedPos.current
            )}
            style={{ position: "relative", marginLeft }}
          >
            <ActionHeader action={action} animateControl={controls} />
            <ActionDetails
              action={action}
              localActions={localActions}
              dispatch={dispatch}
              current={current}
            />
          </li>
        );
      })}
    </ul>
  );
};

const AddStyle = ({ children }) => {
  return (
    <>
      {/* <style type="text/css">{draganddropStyle}</style> */}
      {children}
    </>
  );
};

const finalExp = isWebkit ? WebkitActions : ChromeActions;
export default finalExp;

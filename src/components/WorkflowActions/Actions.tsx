import { useEffect, useRef, useState } from "react";
import ActionHeader from "./ActionHeader";
import ActionDetails from "./ActionDetails";
import { motion, useAnimationControls } from "framer-motion";
import { TAction } from "../../Types/ActionTypes/Action";

function getAnimationClassNames<T extends number>(
  index: T,
  movedItem: T,
  draggedItem: T
): string {
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

const ChromeActions = ({
  current,
  dispatch,
}: {
  actions: TAction[];
  dispatch: any;
  current: any;
}) => {
  const [localActions, setLocalActions] = useState<TAction[]>(
    current.context.flowActions
  ); // local state is required to facilitate drag and drop
  const initialDraggedPos = useRef<number>();
  const movedPos = useRef<number>();
  const enterPos = useRef<number>();
  const draggedPos = useRef<number>();
  const controls = useAnimationControls();

  // CHROME DRAG EVENTS HANDLERS
  const handleDragStart = (e, index) => {
    console.log("handleDragStart");
    e.dataTransfer.effectAllowed = "move";
    const clonedNode = e.target.cloneNode(true);
    e.dataTransfer.setDragImage(clonedNode, 0, 0);
    clonedNode.style.opacity = "0.5";
    // e.dataTransfer.setData('text/plain', 'some_dummy_data'); // firefox
    // itemColor = e.target.style.backgroundColor;
    // e.target.style.opacity = "0.001";

    // tempMarginLeft.current = e.target.style.marginLeft;
    // e.target.style.marginLeft = "";
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
    // e.target.style.backgroundColor = itemColor;

    // e.target.style.marginLeft = tempMarginLeft.current;

    if (initialDraggedPos.current !== draggedPos.current) {
      dispatch({
        type: "DRAG_EVENT",
        payload: { dragInfo: localActions },
      });
    }

    resetRefs();
  };

  /* --------- LINES ANIMATION --------- */
  useEffect(() => {
    controls.start("visible");
  }, [controls, localActions]);

  useEffect(() => {
    // console.log("Workflow -> Actions -> localActions: ", localActions);
    setLocalActions((state) => current.context.flowActions);
  }, [current.context.flowActions]);

  function resetRefs() {
    console.log("resetting refs...");
    enterPos.current = null;
    movedPos.current = null;
    draggedPos.current = null;
    initialDraggedPos.current = null;
  }

  return (
    <ul className="workflow-ul">
      {localActions.map((action, index) => {
        const nest_width_decrease_factor = action.nestingLevel * 15;

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
            style={{
              position: "relative",
              width:
                nest_width_decrease_factor === 0
                  ? "100%"
                  : `calc(400px - ${nest_width_decrease_factor}px`,
              alignSelf: action.nestingLevel > 0 ? "flex-end" : "center",
            }}
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
  );
};

const WebkitActions = ({
  actions,
  dispatch,
  current,
}: {
  actions: TAction[];
  dispatch: any;
  current: any;
}) => {
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

const finalExp = isWebkit ? WebkitActions : ChromeActions;
export default finalExp;

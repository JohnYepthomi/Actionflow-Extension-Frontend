import { useEffect, useRef, useState, useCallback, memo } from "react";
import ActionHeader from "./ActionHeader";
import ActionDetails from "./ActionDetails";
import { motion, useAnimationControls } from "framer-motion";
import { TAction } from "../../Schemas/replaceTypes/Actions";

//WEBKIT ACTIONS IMPORT
// import Card from '../../../../components/SortableList/Card';
// import update from 'immutability-helper';
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { logger } from "../../../../logger";

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

const ChromeActions = ({
  current,
  dispatch,
  service,
}: {
  dispatch: any;
  current: any;
  service: any;
}) => {
  const [localActions, setLocalActions] = useState<TAction[]>(
    current.context.flowActions
  ); // local state is required to facilitate drag and drop
  const initialDraggedPos = useRef<number>();
  const movedPos = useRef<number>();
  const enterPos = useRef<number>();
  const draggedPos = useRef<number>();
  const controls = useAnimationControls();
  const tempMarginLeft = useRef<string>();
  const [isDnD, setIsDnD] = useState<boolean>(false);

  // CHROME DRAG EVENTS HANDLERS
  const handleDragStart = (e: any, index: number) => {
    console.log("handleDragStart");
    e.dataTransfer.effectAllowed = "move";
    const clonedNode = e.target.cloneNode(true);
    e.dataTransfer.setDragImage(clonedNode, 0, 0);
    // clonedNode.style.opacity = "0.5";
    // e.dataTransfer.setData("text/plain", "some_dummy_data"); // firefox
    itemColor = e.target.style.backgroundColor;
    tempMarginLeft.current = e.target.style.marginLeft;
    e.target.style.marginLeft = "";
    draggedPos.current = index;
    initialDraggedPos.current = index;
  };
  const handleDragEnter = (e: any, index: number) => {
    if (enterPos.current) return;
    else enterPos.current = index;

    if (draggedPos?.current !== index) {
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
  const handleDragLeave = (e: any, index: number) => {
    enterPos.current = undefined;
  };
  const handleDragEnd = (e: any, index: number) => {
    e.target.style.backgroundColor = itemColor;
    e.target.style.marginLeft = tempMarginLeft.current;

    if (initialDraggedPos.current !== draggedPos.current) {
      dispatch({
        type: "DRAG_EVENT",
        payload: localActions,
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
    enterPos.current = undefined;
    movedPos.current = undefined;
    draggedPos.current = undefined;
    initialDraggedPos.current = undefined;
  }

  return (
    <ul className="workflow-ul">
      {localActions.map((action, index) => {
        const nest_width_decrease_factor = action.nestingLevel * 15;

        return (
          <motion.li
            key={action.id}
            type="react-dnd"
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={(e) => handleDragLeave(e, index)}
            onDragEnd={(e) => handleDragEnd(e, index)}
            className={getAnimationClassNames(
              index,
              movedPos.current!,
              draggedPos.current!
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
              service={service}
            />
          </motion.li>
        );
      })}
    </ul>
  );
};

//WEBKIT ACTIONS    ::::: DO NOT DELETE :::::
// const SortableActions = ({ current, dispatch }:{current: any, dispatch: any}) => {
//   const [cards, setCards] = useState<TAction>(current.context.flowActions);
//   // const [hasMoved, setHasMoved] = useState<boolean>(false);
//   const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
//       // setHasMoved(state => !state);
//       setCards((prevCards) =>
//       update(prevCards, {
//           $splice: [
//           [dragIndex, 1],
//           [hoverIndex, 0, prevCards[dragIndex]],
//           ],
//       }),
//       )
//   }, []);

//   useEffect(()=>{
//       setCards(current.context.flowActions);
//   },[current.context.flowActions]);

//   // useEffect(()=>{
//   //     if(hasMoved){
//   //         // dispatch({type: "DRAG_EVENT", payload: cards});
//   //     }
//   // },[hasMoved])

//   logger.log("=====rendered===== SORTABLEACTIONS COMPONENT")

//   const renderCard = useCallback((card, index) => {
//       return (
//           <Card
//               key={card.id}
//               id={card.id}
//               index={index}
//               card={card}
//               moveCard={moveCard}
//               cards={cards}
//               current={current}
//               dispatch={dispatch}
//           />
//       )
//   }, []);

//   return (
//       <ul className="workflow-ul" style={{ overflowX: "hidden", overflowY: "scroll" }}>
//           {
//               cards.map( (card, i) => renderCard(card, i))
//           }
//       </ul>
//   );
// }
// const WebkitActions = ({ dispatch, current }:{current: any, dispatch: any}) => {
//   console.log("======rendered====== ACTIONS COMPONENT , flowActions: ", current.context.flowActions);

//   return (
//       <DndProvider backend={HTML5Backend}>
//           <SortableActions dispatch={dispatch} current={current}/>
//       </DndProvider>
//   );
// };

// const finalExp = isWebkit ? WebkitActions : ChromeActions;
// export default memo(WebkitActions);

export default memo(ChromeActions);

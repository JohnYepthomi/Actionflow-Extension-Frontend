import { useEffect, useRef, useState, useCallback, memo } from "react";
import ActionHeader from "./ActionHeader";
import ActionDetails from "./ActionDetails";
import { motion, useAnimationControls } from "framer-motion";
import type { TAction } from "../../Schemas/replaceTypes/Actions";

//WEBKIT ACTIONS IMPORT
import Card from "../SortableList/Card";
import update from "immutability-helper";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function getAnimationClassNames<T extends number>(
  index: T,
  movedItem: T,
  draggedItem: T
): string {
  if (movedItem !== index) return "";
  if (movedItem - draggedItem > 0) return "moved-down";
  else return "move-up";
}

const SortableActions = ({
  current,
  dispatch,
  service,
}: {
  current: any;
  dispatch: any;
  service: any;
}) => {
  const [cards, setCards] = useState<TAction>(current.context.flowActions);
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // state used to trigger update workflow in the database
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    },
    [cards]
  );

  // update flowActions after DND
  useEffect(() => {
    dispatch({ type: "UPDATE_WORKFLOW_FROM_TAURI", workflow: cards });
  }, [cards]);

  useEffect(() => {
    setCards(current.context.flowActions);
  }, [current.context.flowActions]);

  console.log("=====rendered===== SORTABLEACTIONS COMPONENT");

  const renderCard = useCallback(
    (card, index) => {
      return (
        <Card
          key={card.id}
          id={card.id}
          index={index}
          card={card}
          moveCard={moveCard}
          cards={cards}
          current={current}
          dispatch={dispatch}
          service={service}
        />
      );
    },
    [current]
  );

  return (
    <ul
      className="workflow-ul"
      style={{ display: "flex", overflowX: "hidden", overflowY: "scroll" }}
    >
      {cards.map((card, i) => renderCard(card, i))}
    </ul>
  );
};
const WebkitActions = ({
  dispatch,
  current,
  service,
}: {
  current: any;
  dispatch: any;
  service: any;
}) => {
  console.log(
    "======rendered====== ACTIONS COMPONENT , flowActions: ",
    current.context.flowActions
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <SortableActions
        dispatch={dispatch}
        current={current}
        service={service}
      />
    </DndProvider>
  );
};

export default memo(WebkitActions);

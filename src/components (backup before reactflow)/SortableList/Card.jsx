import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./ItemTypes";
import ActionDetails from "../WorkflowActions/ActionDetails";
import ActionHeader from "../WorkflowActions/ActionHeader";

const style = {
  // padding: '0.5rem 1rem',
  // marginBottom: '.5rem',
  // border: '1px dashed gray',
  // backgroundColor: 'transparent',
  cursor: "move",
};

export default function Card({
  id,
  index,
  moveCard,
  card,
  cards,
  current,
  dispatch,
  service,
}) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const nest_width_decrease_factor = card.nestingLevel * 15;

  console.log("=====rendered===== CARD COMPONENT");

  return (
    <li
      onDrop={(event) => {
        // TOGGLE STATE WHEN ITEM IS DROPPED
        dispatch({ type: "DRAG_EVENT" });
      }}
      ref={ref}
      data-handler-id={handlerId}
      style={{
        position: "relative",
        width:
          nest_width_decrease_factor === 0
            ? "100%"
            : `calc(400px - ${nest_width_decrease_factor}px`,
        alignSelf: card.nestingLevel > 0 ? "flex-end" : "center",
        ...style,
        opacity,
        backgroundColor:
          current.context.currentActionTickerId === id ? "rgb(32, 105, 42)" : "",
      }}
    >
      <ActionHeader action={card} />
      <ActionDetails
        action={card}
        localActions={cards}
        dispatch={dispatch}
        current={current}
        service={service}
      />
    </li>
  );
}

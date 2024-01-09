import { useEffect, useRef, useState, useCallback, memo } from "react";
import ActionHeader from "./ActionHeader";
import ActionDetails from "./ActionDetails";
import { TAction } from "../../Schemas/replaceTypes/Actions";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import {
  HStack,
  VStack,
  Input,
  Button,
  Box,
  IconButton,
  Center,
} from "@chakra-ui/react";
import { GoGrabber } from "react-icons/go";
import { EvaluateNesting } from "../../AppState/state";

const StrictModeDroppable = ({ children, ...props }) => {
  /**
   * Makes <Droppable> work with strict mode on.
   * @Ref : https://github.com/atlassian/react-beautiful-dnd/issues/2399
   */
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};

const Actions = ({
  current,
  dispatch,
  service,
  updateAppDatabase,
}: {
  current: any;
  dispatch: any;
  service: any;
  updateAppDatabase: any;
}) => {
  const [localActions, setLocalActions] = useState<TAction[]>(
    current.context.flowActions
  );
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [clickedAction, setClickedAction] = useState<string>();
  const getItemStyle = useCallback(
    (isDragging) => ({
      userSelect: isDragging ? "none" : "auto",
      cursor: isDragging ? "grabbing" : "pointer",
    }),
    []
  );
  const dragContainerRef = useRef();

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newPairs = Array.from(localActions);
    const [movedPair] = newPairs.splice(result.source.index, 1);
    newPairs.splice(result.destination.index, 0, movedPair);

    const computed = EvaluateNesting(newPairs);
    setLocalActions(computed);

    if (!updateAppDatabase) {
      setTimeout(() => {
        dispatch({ type: "DRAG_ACTION_UPDATE", payload: computed });
      }, 500)
    }

    // Used in Tauri's Webkit Context.
    if (updateAppDatabase) updateAppDatabase(computed);

    if (dragContainerRef.current) {
      dragContainerRef.current.style.height = "100%";
    }
  };

  useEffect(() => {
    setLocalActions(current.context.flowActions);
  }, [current.context.flowActions]);

  const container_padding_x = 3;

  const renderActions = useCallback(
    () => (
      <DragDropContext
        onDragEnd={handleDragEnd}
        onBeforeCapture={(info) => {
          const dragged_item = document.querySelector(
            `[data-rbd-draggable-id="${info.draggableId}"]`
          );

          if (dragged_item) {
            const container = dragged_item.parentElement;
            const height = container.clientHeight;

            dragged_item.style.height = "42px";
            dragContainerRef.current = container;
            container.style.height = `${height}px`;
          }

          setClickedAction("");
        }}
      >
        <StrictModeDroppable droppableId="pairs">
          {(provided, snapshot) => {
            return (
              <VStack
                ref={provided.innerRef}
                {...provided.droppableProps}
                spacing={4}
                w={`${400 + container_padding_x * 10}px`}
                overflowX="auto"
                py={3}
                h="100%"
                px={container_padding_x}
                gap={2}
              >
                {localActions.map((action, index) => {
                  const computed_width = action.nestingLevel * 15;

                  return (
                    <Draggable
                      key={action.id}
                      draggableId={action.id}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <VStack
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            w={
                              computed_width === 0
                                ? "100%"
                                : `calc(400px - ${computed_width}px)`
                            }
                            alignSelf={
                              action.nestingLevel > 0 ? "flex-end" : "auto"
                            }
                            style={{
                              ...provided.draggableProps.style,
                              cursor: snapshot.isDragging ? "grab" : "pointer",
                            }}
                            gap={0}
                          >
                            <ActionHeader
                              action={action}
                              current={current}
                              isDragging={snapshot.isDragging}
                              dispatch={dispatch}
                              setClickedAction={setClickedAction}
                              isDetailsVisible={clickedAction === action.id}
                            />

                            {clickedAction === action.id && (
                              <ActionDetails
                                action={action}
                                localActions={localActions}
                                dispatch={dispatch}
                                current={current}
                                service={service}
                              />
                            )}
                          </VStack>
                        );
                      }}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </VStack>
            );
          }}
        </StrictModeDroppable>
      </DragDropContext>
    ),
    [clickedAction, current, localActions]
  );

  return renderActions();
};

export default memo(Actions);

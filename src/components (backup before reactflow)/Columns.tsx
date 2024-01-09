import React, { useState, useEffect } from "react";
import { VStack, Input, Button, Box, IconButton } from "@chakra-ui/react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { GoGrabber } from "react-icons/go";

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

const Columns = ({ pairs, setPairs }: any) => {
  const handleAddPair = () => {
    const newPair = { id: `${Date.now()}`, label: "", value: "" };
    setPairs([...pairs, newPair]);
  };

  const handleChange = (id, key, newValue) => {
    const newPairs = [...pairs];
    const index = newPairs.findIndex((pair) => pair.id === id);
    newPairs[index][key] = newValue;
    setPairs(newPairs);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newPairs = Array.from(pairs);
    const [movedPair] = newPairs.splice(result.source.index, 1);
    newPairs.splice(result.destination.index, 0, movedPair);

    setPairs(newPairs);
  };

  const constrainYAxis = (style) => {
    /* ref: https://github.com/atlassian/react-beautiful-dnd/issues/538 */
    if (style?.transform) {
      const axisLockY = `translate(0px, ${style.transform.split(",").pop()}`;
      return {
        ...style,
        transform: axisLockY,
      };
    }
    return style;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable droppableId="pairs">
        {(provided) => (
          <VStack ref={provided.innerRef} spacing={4} align="start">
            {pairs.map((pair, index) => (
              <Draggable
                key={pair.id}
                draggableId={pair.id}
                index={index}
                axis="y"
              >
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    display="flex"
                    alignItems="center"
                    style={constrainYAxis({
                      ...provided.draggableProps.style,
                      ...(snapshot.isDragging && { cursor: "grabbing" }),
                    })}
                  >
                    <IconButton
                      icon={<GoGrabber />}
                      // backgroundColor="blue.500"
                      size="sm"
                      marginRight="2"
                      {...provided.dragHandleProps}
                    />
                    <Input
                      placeholder="Label"
                      value={pair.label}
                      onChange={(e) =>
                        handleChange(pair.id, "label", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={pair.value}
                      onChange={(e) =>
                        handleChange(pair.id, "value", e.target.value)
                      }
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <Button onClick={handleAddPair} w="fit-content" fontSize="sm">
              Add Column
            </Button>
          </VStack>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};
export default Columns;

import { useState } from "react";
import { VStack, HStack, Box } from "@chakra-ui/react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "take out the garbage" },
    "task-2": { id: "task-2", content: "make some tea" },
    "task-3": { id: "task-3", content: "read the news" },
    "task-4": { id: "task-4", content: "work on project" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
  },
  columnOrder: ["column-1"],
};

function Task({ task, index }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => {
        console.log("Task: ", provided);

        return (
          <div
            style={{
              width: "100%",
              border: "1px solid white !important",
              borderRadius: 2,
              padding: 2,
              marginBottom: 2,
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {task.content}
          </div>
        );
      }}
    </Draggable>
  );
}

function Column({ column, tasks }) {
  return (
    <div
      style={{
        width: "100%",
        margin: 8,
        border: "1px solid lightgray",
        borderRadius: 3,
      }}
    >
      <div style={{ padding: 2 }}>{column.title}</div>
      <Droppable droppableId={column.id}>
        {(provided) => {
          console.log("Column: ", provided);

          return (
            <div
              {...provided.droppableProps}
              style={{ padding: 5 }}
              ref={provided.innerRef}
            >
              {tasks.map((task, index) => {
                return <Task key={task.id} task={task} index={index} />;
              })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

export default function TestBeaut() {
  const [data, setData] = useState(initialData);

  function handleDragEnd() {}

  return (
    <DragDropContext
      // onDragStart
      // onDragUpdate
      onDragEnd={handleDragEnd}
    >
      {data.columnOrder.map((colId) => {
        const col = data.columns[colId];
        const tasks = col.taskIds.map((taskId) => data.tasks[taskId]);

        return <Column key={colId} column={col} tasks={tasks} />;
      })}
    </DragDropContext>
  );
}

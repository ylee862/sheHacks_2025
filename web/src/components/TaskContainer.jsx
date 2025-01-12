import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TaskContainer = ({ socket }) => {
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    function fetchTasks() {
      fetch("http://localhost:3000/api")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setTasks(data);
        });
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    socket.on("tasks", (data) => setTasks(data));
  }, [socket]);

  return (
    <div className="box">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(tasks).map((task) => (
          <div
            className={`${task[1].title.toLowerCase()}__wrapper`}
            key={task[1].title}
          >
            <h3>{task[1].title}</h3>
            <div className={`${task[1].title.toLowerCase()}__container`}>
              <Droppable droppableId="{task[1].title}">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {task[1].items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${task[1].title.toLowerCase()}__items`}
                          >
                            <p>{item.title}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

const handleDragEnd = ({ destination, source }) => {
  if (!destination) return;

  if (
    destination.index === source.index &&
    destination.droppableId === source.droppableId
  )
    return;

  socket.emit("taskDragged", {
    source,
    destination,
  });
};

export default TaskContainer;

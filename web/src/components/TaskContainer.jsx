import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCalendar from "./Calendar";
import StickyNote from "./StickyNote";

const TaskContainer = ({ socket }) => {
  const [tasks, setTasks] = useState({});
  const [showStickyNote, setShowStickyNote] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const saveTask = () => {
    const newTask = {
      id: Math.random().toString(36).substring(2, 10),
      title: taskData.description,
      colour: taskData.colour,
    };

    socket.emit("newTask", newTask); // Emit task to the server
    closeModal(); // Close the modal after saving the task
  };

  useEffect(() => {
    function fetchTasks() {
      fetch("http://localhost:3000/api")
        .then((res) => res.json())
        .then((data) => {
          setTasks(data);
        });
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    socket.on("tasks", (data) => setTasks(data));
  }, [socket]);

  const handleAddTask = () => {
    setShowStickyNote(true);
  };

  const handlePostTask = () => {
    if (!newTaskText.trim() || !newTaskDeadline) return;

    const newTask = {
      id: Math.random().toString(36).substring(2, 10),
      title: newTaskText.trim(),
      deadline: newTaskDeadline, // Add deadline
    };

    socket.emit("newTask", newTask);

    const updatedTasks = {
      ...tasks,
      ideas: {
        ...tasks.ideas,
        items: [...tasks.ideas.items, newTask],
      },
    };

    setTasks(updatedTasks);
    setNewTaskText("");
    setNewTaskDeadline("");
    setShowStickyNote(false);

    //socket.emit("addTask", updatedTasks);
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

  return (
    <div
      className="task-container"
      style={{ display: "flex", height: "100vh" }}
    >
      {/* Left Side: Task Columns */}
      <div
        style={{
          flex: 7,
          display: "flex",
          gap: "2rem",
          justifyContent: "flex-start",
          marginTop: "2rem",
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.entries(tasks).map(([key, task]) => (
            <div
              className={`${task.title.toLowerCase()}__wrapper`}
              key={task.title}
              style={{
                flex: 1,
                minWidth: "250px",
              }}
            >
              <h3>{task.title.toUpperCase()}</h3>
              <div className={`${task.title.toLowerCase()}__container`}>
                <Droppable droppableId={key}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}
                    style={{
                      minHeight: "50px",
                      border: "none",  // Add a dashed border to highlight the drop area
                    }}
                    >
                      {task.items.map((item, index) => (
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
                              className={`${task.title.toLowerCase()}__items`}
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

      {/* Right Side: Calendar and Chat */}
      <div
        style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Calendar */}
        <div
          style={{
            flex: 1,
            border: "none",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          <TaskCalendar tasks={tasks} />
        </div>

        {/* Chat (Empty for now) */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          {/* Placeholder for chat */}
          <h4>Chat (Empty for now)</h4>
        </div>
      </div>

      {/* Modal button for creating tasks */}
      <button
        onClick={openModal}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          fontSize: "2rem",
          padding: "10px",
          borderRadius: "75px",
          backgroundColor: "teal",
          color: "white",
          border: "none",
        }}
      >
        +
      </button>
      {isModalOpen && (
        <StickyNote
          taskData={taskData}
          setTaskData={setTaskData}
          saveTask={saveTask}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default TaskContainer;

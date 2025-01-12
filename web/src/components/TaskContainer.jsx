import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCalendar from "./Calendar";

const TaskContainer = ({ socket }) => {
  const [tasks, setTasks] = useState({});
  const [showStickyNote, setShowStickyNote] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");

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

    socket.emit("addTask", updatedTasks);
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
      <button
        onClick={handleAddTask}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          fontSize: "2rem",
          padding: "10px",
          borderRadius: "75px",
          backgroundColor: "teal",
          cursor: "pointer",
          color: "white",
          border: "none",
        }}
      >
        +
      </button>

      {showStickyNote && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            padding: "1rem",
            backgroundColor: "#fffae3",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "300px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <textarea
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Enter task description..."
            style={{
              width: "100%",
              height: "80px",
              padding: "0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
              resize: "none",
            }}
          />
          <input
            type="date"
            value={newTaskDeadline}
            onChange={(e) => setNewTaskDeadline(e.target.value)}
            style={{
              marginTop: "0.5rem",
              width: "100%",
              padding: "0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
            <button
              onClick={() => setShowStickyNote(false)}
              style={{
                marginRight: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#f4f4f4",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handlePostTask}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Post
            </button>
          </div>
        </div>
      )}

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
              <h3>{task.title}</h3>
              <div className={`${task.title.toLowerCase()}__container`}>
                <Droppable droppableId={key}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
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
    </div>
  );
};

export default TaskContainer;

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskCalendar from "./Calendar";

const TaskContainer = ({ socket }) => {
  const [tasks, setTasks] = useState({});
  const [showStickyNote, setShowStickyNote] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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
    // Listen for real-time updates
    socket.on("tasks", (data) => setTasks(data));

    // Listen for new chat messages
    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
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

    // Make sure to create a deep copy of tasks and not just a shallow one
    const updatedTasks = { ...tasks };

    if (!updatedTasks.ideas) {
      updatedTasks.ideas = { items: [] };
    }

    updatedTasks.ideas.items.push(newTask);

    // Update state
    setTasks(updatedTasks);
    setNewTaskText("");
    setNewTaskDeadline("");
    setShowStickyNote(false);

    // Emit updated tasks
    socket.emit("tasks", updatedTasks);
  };

  const handleTaskClick = (task) => {
    setEditingTask(task);
    setNewTaskText(task.title);
    setNewTaskDeadline(task.deadline);
  };

  const handleEditSave = () => {
    if (!newTaskText.trim() || !newTaskDeadline) return;

    const updatedTasks = { ...tasks };
    Object.keys(updatedTasks).forEach((columnKey) => {
      updatedTasks[columnKey].items = updatedTasks[columnKey].items.map(
        (item) =>
          item.id === editingTask.id
            ? { ...item, title: newTaskText, deadline: newTaskDeadline }
            : item
      );
    });

    setTasks(updatedTasks);
    setEditingTask(null);
    setNewTaskText("");
    setNewTaskDeadline("");
    socket.emit("tasks", updatedTasks);
  };

  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return; // No valid drop destination
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return; // No change in position

    // Get the source and destination containers
    const sourceColumn = tasks[source.droppableId];
    const destinationColumn = tasks[destination.droppableId];

    // Copy the items
    const sourceItems = Array.from(sourceColumn.items);
    const destinationItems = Array.from(destinationColumn.items);

    // Remove the dragged item from the source
    const [draggedItem] = sourceItems.splice(source.index, 1);

    // Add the dragged item to the destination
    destinationItems.splice(destination.index, 0, draggedItem);

    // Update the state with the new task positions
    const updatedTasks = {
      ...tasks,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destinationColumn,
        items: destinationItems,
      },
    };

    // Update the state locally
    setTasks(updatedTasks);

    // Emit the updated tasks to the server
    socket.emit("tasks", updatedTasks);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit("chatMessage", newMessage);
    setMessages((prevMessages) => [...prevMessages, `You: ${newMessage}`]);
    setNewMessage("");
  };

  return (
    <div className="task-container" style={{ display: "flex", height: "80vh" }}>
      <button
        onClick={handleAddTask}
        style={{
          display: "flex", // Centers the "+" symbol
          justifyContent: "center", // Centers the "+" symbol horizontally
          alignItems: "center", // Centers the "+" symbol vertically
          position: "fixed",
          bottom: "20px",
          right: "20px",
          fontSize: "2rem",
          width: "60px", // Adjust width for a circular shape
          height: "60px", // Same as width for a perfect circle
          borderRadius: "50%", // Ensures the button is circular
          backgroundColor: "#063970",
          cursor: "pointer",
          color: "white",
          border: "none",
          paddingBottom: "8px",
        }}
      >
        +
      </button>
      {/* Chat log */}
      <div
        style={{
          position: "fixed",
          bottom: "100px",
          right: "20px",
          width: "440px",
          height: "200px",
          backgroundColor: "#f1f1f1",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "0.5rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            fontSize: "1.3rem",
            fontWeight: "bold",
            color: "#0077CC",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          Team Chat
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0.5rem",
          }}
        >
          {messages.map((message, index) => (
            <div key={index} style={{ marginBottom: "0.5rem" }}>
              {message}
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSendMessage}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              backgroundColor: "#063970",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>

      {editingTask && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            padding: "1rem",
            backgroundColor: "#fafafa",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "300px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          <h3>Edit Task</h3>
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

          <p
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#063970",
            }}
          >
            Set Deadline:
          </p>
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
              onClick={() => setEditingTask(null)}
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
              onClick={handleEditSave}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#063970",
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

      {showStickyNote && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            padding: "1rem",
            backgroundColor: "#fafafa",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "300px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
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

          <p
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#063970",
            }}
          >
            Set Deadline:
          </p>
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
                backgroundColor: "#063970",
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
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Shadow effect
                height: "100%",
              }}
            >
              <h3
                style={{
                  textAlign: "center",
                  fontSize: "1.2rem",
                  marginBottom: "1rem",
                }}
              >
                {task.title}
              </h3>
              <div className={`${task.title.toLowerCase()}__container`}>
                <Droppable droppableId={key} key={key}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: "200px",
                        borderRadius: "8px",
                        padding: "1rem",
                        height: "100%", // Ensure each wrapper fills the full height of the container
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
                              style={{
                                position: "relative", // Keep this to control absolute positioning for deadline
                                marginBottom: "20px", // Ensure space between items
                                cursor: "pointer",
                                marginBottom: "1rem",
                                padding: "1rem",
                                backgroundColor: "#fafafa",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                ...provided.draggableProps.style,
                              }}
                              onClick={() => handleTaskClick(item)}
                            >
                              <p>{item.title}</p>
                              {item.deadline && (
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "10px",
                                    left: "10px",
                                    fontSize: "0.9rem",
                                    color: "grey",
                                  }}
                                >
                                  Deadline: {item.deadline}
                                </div>
                              )}
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
            marginTop: "-60px",
          }}
        >
          <TaskCalendar tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default TaskContainer;

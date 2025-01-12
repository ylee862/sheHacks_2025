import React, { useState } from "react";
import TaskContainer from "./TaskContainer";
import NavBar from "./NavBar";
import { io } from "socket.io-client";
import StickyNote from "./StickyNote";

// connect the server side
const socket = io("http://localhost:3000", { path: "/socket.io" });

const MainTask = () => {
  const [projectName, setProjectName] = useState("Project");
  const [isModalOpen, setIsModalOpen] = useState("false");
  const [taskData, setTaskData] = useState({description: "", colour: "#ffffff" });

  const setProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false)

  const saveTask = () => {
    const newTask = {
      id: Math.random().toString(36).substring(2, 10),
      title: taskData.description,
      colour: taskData.colour,
      deadline: taskData.deadline,
    };

    socket.emit("newTask", newTask);
    setTaskData({ description: "", colour: "#ffffff", deadline: "" });
    closeModal();
  }

  return (
    <div>
      <NavBar />
      <TaskContainer socket={socket} />
      <button
        onClick={openModal}
        style = {{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          fontSize: "2rem",
          padding: "10px",
          borderRadius: "50px",
          backgroundColor: "teal",
          color: "white",
          border: "none"
        }}>
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

export default MainTask;
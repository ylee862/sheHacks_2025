import React, { useState } from "react";
import TaskContainer from "./TaskContainer";
import NavBar from "./NavBar";
import { io } from "socket.io-client";

// connect the server side
const socket = io("http://localhost:3000", { path: "/socket.io" });

const MainTask = () => {
  const [projectName, setProjectName] = useState("Project");

  const setProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  return (
    <div>
      <NavBar projectName={projectName} />
      <div style={{ margin: "1rem", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Enter Project Name"
          value={projectName}
          onChange={setProjectNameChange}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </div>
      <TaskContainer socket={socket} />
    </div>
  );
};

export default MainTask;

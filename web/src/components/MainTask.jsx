import React from "react";
import TaskContainer from "./TaskContainer";
import NavBar from "./NavBar";
import { io } from "socket.io-client";

// connect the server side
const socket = io("http://localhost:3000", { path: "/socket.io" });

const MainTask = () => {
  return (
    <div>
      <NavBar />
      <TaskContainer socket={socket} />
    </div>
  );
};

export default MainTask;

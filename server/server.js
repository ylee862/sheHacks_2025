const express = require("express");
const { Server } = require("socket.io");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const cors = require("cors");
const http = require("http");

app.use(cors());

//to allow transfer between client and server
const server = http.createServer(app);

//Socket.io for real-time connection
const socketIO = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
  path: "/socket.io",
});

//Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("createTask", (data) => {
    const newTask = { id: fetchID(), title: data.task, comments: [] };

    tasks["pending"].items.push(newTask);

    socket.emit("tasks", tasks);
  });

  socket.on("taskDragged", (data) => {
    const { source, destination } = data;

    const itemShifted = {
      ...tasks[source.droppableId].items[source.index],
    };
    console.log("ItemDragged = ", itemShifted);

    tasks[source.droppableId].items.splice(source.index, 1);

    tasks[destination.droppableId].items.splice(
      destination.index,
      0,
      itemShifted
    );

    socket.emit("tasks", tasks);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

const fetchID = () => Math.random().toString(36).substring(2, 10);

let tasks = {
  ideas: {
    title: "ideas",
    items: [
      {
        id: fetchID(),
        title: "draw er diagram",
      },
    ],
  },

  todo: {
    title: "todo",
    items: [
      {
        id: fetchID(),
        title: "draw another diagram",
      },
    ],
  },

  doing: {
    title: "doing",
    items: [
      {
        id: fetchID(),
        title: "coloring",
      },
    ],
  },

  done: {
    title: "done",
    items: [
      {
        id: fetchID(),
        title: "send it to someone",
      },
    ],
  },
};

app.get("/api", (req, res) => {
  res.json(tasks);
});

server.listen(3000, () => {
  console.log(`Server is running on port 3000.`);
});

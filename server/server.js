const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

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
      itemMoved
    );

    socket.emit("tasks", tasks);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.use(cors());

server.listen(3000, () => {
  console.log(`Server is running on port 3000.`);
});

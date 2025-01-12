const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust based on your frontend's origin
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

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

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle incoming chat messages
  socket.on("chatMessage", (message) => {
    console.log("Received message:", message);
    io.emit("chatMessage", message); // Broadcast message to all clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.get("/api", (req, res) => {
  res.json(tasks);
});

app.post("/newTask", (req, res) => {
  const newTask = req.body;
  if (!tasks.ideas) {
    tasks.ideas = { title: "ideas", items: [] };
  }
  tasks.ideas.items.push(newTask);
  io.emit("tasks", tasks);
  res.status(200).send("Task added");
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

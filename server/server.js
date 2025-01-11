const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//to allow transfer between client and server
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

//Socket.io for real-time connection
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

http.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});

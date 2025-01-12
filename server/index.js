const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
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

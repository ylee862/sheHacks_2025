import React, { useState } from "react";
import "./App.css";

// Kanban Board Component
function KanbanBoard() {
  const [notes, setNotes] = useState({
    Ideas: [],
    "To-Do": [],
    Doing: [],
    Done: [],
  });
  const [newNote, setNewNote] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("Ideas");

  const getRandomColor = () => {
    const colors = ["#FFD700", "#FF6347", "#98FB98", "#00BFFF", "#FF4500"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addNote = () => {
    if (newNote.trim() !== "") {
      const newNotes = { ...notes };
      const newNoteObject = {
        id: Date.now(),
        content: newNote,
        color: getRandomColor(),
      };
      newNotes[selectedColumn].push(newNoteObject);
      setNotes(newNotes);
      setNewNote("");
    }
  };

  const removeNote = (id, column) => {
    const newNotes = { ...notes };
    newNotes[column] = newNotes[column].filter((note) => note.id !== id);
    setNotes(newNotes);
  };

  const handleDrop = (e, column) => {
    const noteId = e.dataTransfer.getData("noteId");
    const noteColumn = e.dataTransfer.getData("noteColumn");

    const noteToMove = notes[noteColumn].find((note) => note.id === Number(noteId));

    if (noteToMove) {
      const newNotes = { ...notes };
      newNotes[noteColumn] = newNotes[noteColumn].filter(
        (note) => note.id !== Number(noteId)
      );
      noteToMove.color = getRandomColor();
      newNotes[column].push(noteToMove);
      setNotes(newNotes);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragStart = (e, noteId, column) => {
    e.dataTransfer.setData("noteId", noteId);
    e.dataTransfer.setData("noteColumn", column);
  };

  return (
    <div className="kanban-board">
      <h2>Kanban Board</h2>
      <div className="note-input">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a sticky note"
        ></textarea>
        <select
          value={selectedColumn}
          onChange={(e) => setSelectedColumn(e.target.value)}
        >
          <option value="Ideas">Ideas</option>
          <option value="To-Do">To-Do</option>
          <option value="Doing">Doing</option>
          <option value="Done">Done</option>
        </select>
        <button onClick={addNote}>Add Note</button>
      </div>
      <table className="kanban-table">
        <thead>
          <tr>
            <th onDrop={(e) => handleDrop(e, "Ideas")} onDragOver={handleDragOver}>
              Ideas
            </th>
            <th onDrop={(e) => handleDrop(e, "To-Do")} onDragOver={handleDragOver}>
              To-Do
            </th>
            <th onDrop={(e) => handleDrop(e, "Doing")} onDragOver={handleDragOver}>
              Doing
            </th>
            <th onDrop={(e) => handleDrop(e, "Done")} onDragOver={handleDragOver}>
              Done
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {notes.Ideas.map((note) => (
                <div
                  key={note.id}
                  className="sticky-note"
                  draggable
                  onDragStart={(e) => handleDragStart(e, note.id, "Ideas")}
                  style={{ backgroundColor: note.color }}
                >
                  <p>{note.content}</p>
                  <button onClick={() => removeNote(note.id, "Ideas")}>
                    Remove
                  </button>
                </div>
              ))}
            </td>
            <td>
              {notes["To-Do"].map((note) => (
                <div
                  key={note.id}
                  className="sticky-note"
                  draggable
                  onDragStart={(e) => handleDragStart(e, note.id, "To-Do")}
                  style={{ backgroundColor: note.color }}
                >
                  <p>{note.content}</p>
                  <button onClick={() => removeNote(note.id, "To-Do")}>
                    Remove
                  </button>
                </div>
              ))}
            </td>
            <td>
              {notes.Doing.map((note) => (
                <div
                  key={note.id}
                  className="sticky-note"
                  draggable
                  onDragStart={(e) => handleDragStart(e, note.id, "Doing")}
                  style={{ backgroundColor: note.color }}
                >
                  <p>{note.content}</p>
                  <button onClick={() => removeNote(note.id, "Doing")}>
                    Remove
                  </button>
                </div>
              ))}
            </td>
            <td>
              {notes.Done.map((note) => (
                <div
                  key={note.id}
                  className="sticky-note"
                  draggable
                  onDragStart={(e) => handleDragStart(e, note.id, "Done")}
                  style={{ backgroundColor: note.color }}
                >
                  <p>{note.content}</p>
                  <button onClick={() => removeNote(note.id, "Done")}>
                    Remove
                  </button>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Chatbox Component
function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "Alice", text: "Hi team! Let's work on the Kanban board." },
    { sender: "Bob", text: "Sure, I'll take care of the 'Doing' column." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-box">
      <h3>Team Chat</h3>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <p key={index}>
            <strong>{message.sender}: </strong>
            {message.text}
          </p>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

// Calendar Component
function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderCalendar = () => {
    const days = daysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const grid = [];

    // Fill empty cells before the first day of the current month
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div className="calendar-cell empty" key={`empty-${i}`}></div>);
    }

    // Fill cells for each day of the current month
    for (let day = 1; day <= days; day++) {
      grid.push(
        <div className="calendar-cell" key={day}>
          {day}
        </div>
      );
    }

    // Fill empty cells after the last day of the current month to maintain alignment
    const totalCells = firstDay + days;
    const emptyCellsAfter = 7 - (totalCells % 7);
    if (emptyCellsAfter < 7) {
      for (let i = 0; i < emptyCellsAfter; i++) {
        grid.push(
          <div className="calendar-cell empty" key={`after-empty-${i}`}></div>
        );
      }
    }

    return grid;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h3>
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button onClick={nextMonth}>▶</button>
      </div>
      <div className="calendar-grid">
        <div className="calendar-cell day-name">Sun</div>
        <div className="calendar-cell day-name">Mon</div>
        <div className="calendar-cell day-name">Tue</div>
        <div className="calendar-cell day-name">Wed</div>
        <div className="calendar-cell day-name">Thu</div>
        <div className="calendar-cell day-name">Fri</div>
        <div className="calendar-cell day-name">Sat</div>
        {renderCalendar()}
      </div>
    </div>
  );
}

// App Component
function App() {
  return (
    <div className="App">
      <KanbanBoard />
      <div className="right-panel">
        <Calendar />
        <ChatBox />
      </div>
    </div>
  );
}

export default App;

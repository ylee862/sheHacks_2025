import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainTask from "./components/MainTask";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/task" element={<MainTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// // Kanban Column Component
// function KanbanColumn({ columnName, notes, onDrop, onDragStart, removeNote }) {
//   return (
//     <td
//       onDrop={(e) => onDrop(e, columnName)}
//       onDragOver={(e) => e.preventDefault()}
//     >
//       {notes.map((note) => (
//         <div
//           key={note.id}
//           className="sticky-note"
//           draggable
//           onDragStart={(e) => onDragStart(e, note.id, columnName)}
//           style={{ backgroundColor: note.color }}
//         >
//           <p>{note.content}</p>
//           <button onClick={() => removeNote(note.id, columnName)}>Remove</button>
//         </div>
//       ))}
//     </td>
//   );
// }

// function KanbanBoard() {
//   const [notes, setNotes] = useState({
//     Ideas: [],
//     "To-Do": [],
//     Doing: [],
//     Done: [],
//   });
//   const [newNote, setNewNote] = useState("");
//   const [selectedColumn, setSelectedColumn] = useState("Ideas");

//   const getRandomColor = () => {
//     const colors = ["#FFD700", "#FF6347", "#98FB98", "#00BFFF", "#FF4500"];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   const addNote = () => {
//     if (newNote.trim() !== "") {
//       const newNotes = { ...notes };
//       const newNoteObject = {
//         id: Date.now(),
//         content: newNote,
//         color: getRandomColor(),
//       };
//       newNotes[selectedColumn].push(newNoteObject);
//       setNotes(newNotes);
//       setNewNote("");
//     }
//   };

//   const removeNote = (id, column) => {
//     const newNotes = { ...notes };
//     newNotes[column] = newNotes[column].filter((note) => note.id !== id);
//     setNotes(newNotes);
//   };

//   const handleDrop = (e, column) => {
//     const noteId = e.dataTransfer.getData("noteId");
//     const noteColumn = e.dataTransfer.getData("noteColumn");

//     const noteToMove = notes[noteColumn].find((note) => note.id === Number(noteId));
//     if (noteToMove) {
//       const newNotes = { ...notes };
//       newNotes[noteColumn] = newNotes[noteColumn].filter(
//         (note) => note.id !== Number(noteId)
//       );
//       noteToMove.color = getRandomColor();
//       newNotes[column].push(noteToMove);
//       setNotes(newNotes);
//     }
//   };

//   const handleDragStart = (e, noteId, column) => {
//     e.dataTransfer.setData("noteId", noteId);
//     e.dataTransfer.setData("noteColumn", column);
//   };

//   return (
//     <div className="kanban-board">
//       <h2>Kanban Board</h2>
//       <div className="note-input">
//         <textarea
//           value={newNote}
//           onChange={(e) => setNewNote(e.target.value)}
//           placeholder="Add a sticky note"
//         ></textarea>
//         <select
//           value={selectedColumn}
//           onChange={(e) => setSelectedColumn(e.target.value)}
//         >
//           <option value="Ideas">Ideas</option>
//           <option value="To-Do">To-Do</option>
//           <option value="Doing">Doing</option>
//           <option value="Done">Done</option>
//         </select>
//         <button onClick={addNote}>Add Note</button>
//       </div>
//       <table className="kanban-table">
//         <thead>
//           <tr>
//             {["Ideas", "To-Do", "Doing", "Done"].map((column) => (
//               <th key={column}>{column}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             {["Ideas", "To-Do", "Doing", "Done"].map((column) => (
//               <KanbanColumn
//                 key={column}
//                 columnName={column}
//                 notes={notes[column]}
//                 onDrop={handleDrop}
//                 onDragStart={handleDragStart}
//                 removeNote={removeNote}
//               />
//             ))}
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// function App() {
//   return (
//     <div className="App">
//       <KanbanBoard />
//     </div>
//   );
// }

// export default App;

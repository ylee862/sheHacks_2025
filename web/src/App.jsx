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

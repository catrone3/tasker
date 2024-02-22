// App.js
import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import Projects from "./components/Projects";
import Tasks from "./components/Tasks";
import TaskCreation from "./components/TaskCreation";
import KanbanBoardPage from "./components/Subcomponents/KanbanBoardPage";
import BacklogPage from "./components/Subcomponents/BacklogPage";
import ProjectDetail from "./components/ProjectDetails";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import Modal from "@mui/material/Modal";

function App() {
  const history = createMemoryHistory();
  const [open, setOpen] = useState(false);
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter location={history.location} navigator={history}>
        <div className="container">
          <Sidebar setOpen={setOpen} />
          <main>
            <Modal open={open} onClose={() => setOpen(false)}>
              <TaskCreation setOpen={setOpen} />
            </Modal>
            <Routes>
              <Route path="/" element={<Content />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route
                path="/projects/:projectId/kanban"
                element={<KanbanBoardPage />}
              />
              <Route
                path="/projects/:projectId/backlog"
                element={<BacklogPage />}
              />
              <Route path="/tasks/create" element={<TaskCreation />} />
              <Route path="/tasks" element={<Tasks />} />
              {/* Add more routes for other content pages */}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

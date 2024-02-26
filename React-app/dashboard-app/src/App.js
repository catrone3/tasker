// App.js
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Content from "./components/Content";
import Projects from "./components/Projects";
import Tasks from "./components/Tasks";
import TaskCreation from "./components/TaskCreation";
import LoginPage from "./components/LoginPage";
import Settings from "./components/Settings";
import KanbanBoardPage from "./components/Subcomponents/KanbanBoardPage";
import BacklogPage from "./components/Subcomponents/BacklogPage";
import ProjectDetail from "./components/ProjectDetails";
import { getToken, isTokenValid } from "./helpers/api";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createMemoryHistory } from "history";
import Modal from "@mui/material/Modal";

function App() {
  const history = createMemoryHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to verify token validity
  useEffect(() => {
    const verifyToken = async () => {
      const token = getToken();
      if (token) {
        try {
          // Perform token validation logic here
          // For example, send a request to the server to validate the token
          const isValid = await isTokenValid(token);
          if (isValid) {
            setIsLoggedIn(true);
          } else {
            // Token is invalid, redirect to login
            history.push("/login");
          }
        } catch (error) {
          console.error("Error validating token:", error);
          // Handle error as needed
        }
      } else {
        // No token found, redirect to login
        history.push("/login");
      }
    };

    // Verify token when component mounts
    verifyToken();
  }, [history, setIsLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <Navbar />
      <BrowserRouter location={history.location} navigator={history}>
        <Routes>
          <Route
            path="*"
            element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}
          />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const ProtectedRoutes = (isLoggedIn) => {
  const [open, setOpen] = useState(false);
  console.log(`isLoggedIn: ${isLoggedIn}`);
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
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
          <Route path="/settings" element={<Settings />} />
          {/* Add more routes for other content pages */}
        </Routes>
      </main>
    </div>
  );
};

export default App;

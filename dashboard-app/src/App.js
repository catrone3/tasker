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
import { getToken, isTokenValid, getProjects } from "./helpers/api";
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
            setIsLoggedIn(false);
            history.push("/login");
          }
        } catch (error) {
          setIsLoggedIn(false);
          console.error("Error validating token:", error);
          // Handle error as needed
        }
      } else {
        // No token found, redirect to login
        setIsLoggedIn(false);
        history.push("/login");
      }
    };

    // Verify token when component mounts
    verifyToken();
  }, [history, setIsLoggedIn]);

  const handleLogin = () => {
    console.log(isLoggedIn);
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      <Navbar />
      <BrowserRouter location={history.location} navigator={history}>
        <Routes>
          {isLoggedIn ? (
            <Route
              path="*"
              element={<ProtectedRoutes isLoggedIn={isLoggedIn} />}
            />
          ) : (
            <>
              <Route path="*" element={<Navigate to="/login" />} />
              <Route
                path="/login"
                element={<LoginPage onLogin={handleLogin} />}
              />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

const ProtectedRoutes = () => {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Make API call to fetch projects
    getProjects()
      .then((data) => {
        console.log(data.projects);
        setProjects(data.projects);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="container">
      <Sidebar setOpen={setOpen} />
      <main>
        <div className="flex justify-left">
          <button className="mr-2">Create Task</button>
          <select className="ml-2">
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
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

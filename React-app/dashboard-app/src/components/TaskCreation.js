import React, { useState, useEffect } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import { getProjectSettings, getProjects } from "../helpers/api";

const TaskCreation = ({ setOpen }) => {
  // State for form fields
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [user, setUserProjects] = useState("");
  const [status, setStatus] = useState("");
  const [project, setProject] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [projectSettings, setProjectSettings] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData.projects);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // Function to fetch project settings
  const fetchProjectSettings = async (projectId) => {
    try {
      const data = await getProjectSettings(projectId);
      setProjectSettings(data.settings);
    } catch (error) {
      console.error("Error fetching project settings:", error);
    }
  };

  // useEffect to fetch project settings when project value changes
  useEffect(() => {
    if (project) {
      fetchProjectSettings(project);
    }
  }, [project]);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    setOpen(false); // Close modal after submission
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        width: 400,
        borderRadius: 4,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Create Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          fullWidth
        >
          {loadingProjects ? (
            <MenuItem disabled>Loading projects...</MenuItem>
          ) : projects.length === 0 ? (
            <p>No projects available.</p>
          ) : (
            projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))
          )}
        </TextField>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Due Date"
            value={dueDate}
            onChange={(date) => setDueDate(date)}
            fullWidth
            inputFormat="MM/dd/yyyy"
          />
        </LocalizationProvider>
        <TextField
          select
          label="Urgency"
          value={urgency}
          onChange={(e) => setUrgency(e.target.value)}
          fullWidth
          disabled={!projectSettings}
        >
          {projectSettings.urgencyOptions &&
            projectSettings.urgencyOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
        </TextField>
        <TextField
          label="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          fullWidth
          disabled={!projectSettings}
        >
          {projectSettings.statusOptions &&
            projectSettings.statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
        </TextField>
        <Button type="submit" variant="contained" color="primary">
          Create Task
        </Button>
      </form>
    </Box>
  );
};

export default TaskCreation;

import React, { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { getProjectSettings, getProjects } from "../helpers/api";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProjectSelect from "./Subcomponents/ProjectSelect";
import TaskFields from "./Subcomponents/TaskFields";

let theme = createTheme({
  // Theme customization goes here as usual, including tonalOffset and/or
  // contrastThreshold as the augmentColor() function relies on these
});

theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    sky: theme.palette.augmentColor({
      color: {
        main: "#5BC3EB",
      },
      name: "sky",
    }),
  },
});

const TaskCreation = ({ setOpen }) => {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [project, setProject] = useState("");
  const [projectSettings, setProjectSettings] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    urgency: "",
    assignedTo: "",
    status: "",
    dueDate: null,
  });

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

  useEffect(() => {
    if (project) {
      fetchProjectSettings(project);
    }
  }, [project]);

  const fetchProjectSettings = async (project) => {
    try {
      const data = await getProjectSettings(project._id);
      console.log(data);
      setProjectSettings(data.settings);
    } catch (error) {
      console.error("Error fetching project settings:", error);
    }
  };

  const handleProjectChange = (selectedProjectId) => {
    setProject(selectedProjectId);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      dueDate: date,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    setOpen(false); // Close modal after submission
  };

  return (
    <ThemeProvider theme={theme}>
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
          <ProjectSelect
            projects={projects}
            loadingProjects={loadingProjects}
            project={project}
            onChange={handleProjectChange}
          />
          {project && (
            <TaskFields
              formData={formData}
              projectSettings={projectSettings}
              onChange={handleFormChange}
              onDateChange={handleDateChange}
            />
          )}
          <Button type="submit" variant="contained" color="sky">
            Create Task
          </Button>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default TaskCreation;

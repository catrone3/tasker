import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { getProjects } from "../helpers/api";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch projects when component mounts
    fetchProjects();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <List>
          {projects.map((project) => (
            <ListItem key={project.id}>
              <ListItemText
                primary={
                  <Link to={`/projects/${project.id}`}>{project.name}</Link>
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default Projects;

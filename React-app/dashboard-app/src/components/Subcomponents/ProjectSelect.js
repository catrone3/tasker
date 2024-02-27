// ProjectSelect.js
import React from "react";
import { TextField, MenuItem } from "@mui/material";

const ProjectSelect = ({ projects, loadingProjects, project, onChange }) => {
  return (
    <TextField
      select
      label="Project"
      value={project ?? ``}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
    >
      {loadingProjects ? (
        <MenuItem disabled>Loading projects...</MenuItem>
      ) : projects.length === 0 ? (
        <MenuItem disabled>No projects available.</MenuItem>
      ) : (
        projects.map((project) => (
          <MenuItem key={project.id} value={project}>
            {project.name}
          </MenuItem>
        ))
      )}
    </TextField>
  );
};

export default ProjectSelect;

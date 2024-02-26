// components/ProjectCreationForm.js

import React, { useState } from "react";
import { createProject } from "../../helpers/api"; // Assuming you have an API function for creating projects

const ProjectCreationForm = () => {
  const [projectName, setProjectName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(projectName);

      console.log("Project created successfully!");
      // Optionally, you can redirect the user or display a success message
    } catch (error) {
      console.error("Error creating project:", error.message);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        placeholder="Project Name"
      />
      <button type="submit">Create Project</button>
    </form>
  );
};

export default ProjectCreationForm;

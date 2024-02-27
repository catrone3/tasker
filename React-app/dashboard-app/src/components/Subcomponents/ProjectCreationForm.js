import React, { useState } from "react";
import { createProject, putProjectSettings } from "../../helpers/api";

const ProjectCreationForm = () => {
  const [projectName, setProjectName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProject(projectName);
      setErrorMessage("");
      setSuccessMessage("Project created successfully!");
      // Optionally, you can redirect the user or display a success message
    } catch (error) {
      console.error("Error creating project:", error.message);
      setSuccessMessage("");
      if (error.message === "Conflict") {
        setErrorMessage(
          <>
            A project with this name already exists. <br />
            Please choose a different name.
          </>
        );
      } else {
        setErrorMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project Name"
        />
        <button type="submit">Create Project</button>
      </form>
      {errorMessage && (
        <div
          className="error-message"
          style={{ fontWeight: "bold", color: "red" }}
        >
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div
          className="success-message"
          style={{ fontWeight: "bold", color: "green" }}
        >
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default ProjectCreationForm;

import React, { useEffect, useState } from "react";
import {
  getProjects,
  getProjectSettings,
  getProjectByName,
  updateProjectPermissions,
  putProjectSettings,
} from "../../helpers/api";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

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

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [settings, setProjectSettings] = useState({});
  const [projectId, setProjectId] = useState("");
  const [username, setUsername] = useState("");
  const [permissions, setPermissions] = useState("");
  const [permissionsOptions, setPermissionsOptions] = useState([]);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData.projects);
      } catch (error) {
        console.error("Error fetching projects:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const fetchSettings = async (projectName) => {
    try {
      const Id = await getProjectByName(projectName);
      setProjectId(Id);
      getProjectSettings(Id).then((res) => {
        setProjectSettings(res);
        setPermissionsOptions(res.permissionOptions);
      });
    } catch (err) {
      console.error("Error fetching project settings:", err.message);
    }
  };

  const handleAddCustomField = () => {
    if (newFieldName.trim() !== "") {
      const newSettings = {
        ...settings,
        customFields: {
          ...settings.customFields,
          [newFieldName]: newFieldValue,
        },
      };
      setProjectSettings(newSettings);
      setNewFieldName("");
      setNewFieldValue("");
    }
  };

  const handleProjectChange = async (projectId) => {
    setSelectedProject(projectId);
    await fetchSettings(projectId);
  };

  const handlePermissionsChange = async () => {
    try {
      const projectId = projects.find(
        (obj) => obj.name === selectedProject
      )._id;
      await updateProjectPermissions(projectId, username, permissions);
      console.log("Project permissions updated successfully!");
    } catch (error) {
      console.error("Error updating project permissions:", error.message);
    }
  };
  const handleSubmit = async () => {
    try {
      // Send updated project settings to your backend API
      const response = await putProjectSettings(projectId, settings);
      if (!response.ok) {
        throw new Error("Failed to save project settings");
      }
      console.log("Project settings saved successfully!");
    } catch (error) {
      console.error("Error saving project settings:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <div>
          <select
            onChange={(e) => handleProjectChange(e.target.value)}
            value={selectedProject}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {selectedProject && (
            <div>
              <h3>{projects.find((p) => p.id === selectedProject)?.name}</h3>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />

              <label htmlFor="permissions">Permissions:</label>
              <select
                id="permissions"
                value={permissions}
                onChange={(e) => setPermissions(e.target.value)}
              >
                <option value="">Select Permissions</option>
                {permissionsOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <button onClick={handlePermissionsChange}>
                Update Permissions
              </button>

              {/* Render urgency and status dropdowns */}
              <div>
                <label htmlFor="urgency">Urgency:</label>
                <input
                  type="text"
                  id="urgency"
                  value={settings.urgency}
                  onChange={(e) => {
                    const newSettings = {
                      ...settings,
                      urgency: e.target.value,
                    };
                    setProjectSettings(newSettings);
                  }}
                />
              </div>

              <div>
                <label htmlFor="status">Status:</label>
                <input
                  type="text"
                  id="status"
                  value={settings.status}
                  onChange={(e) => {
                    const newSettings = { ...settings, status: e.target.value };
                    setProjectSettings(newSettings);
                  }}
                />
              </div>
              <div>
                <label htmlFor="status">Permission Levels:</label>
                <input
                  type="text"
                  id="permissionOptions"
                  value={settings.permissionOptions}
                  onChange={(e) => {
                    const newSettings = {
                      ...settings,
                      permissionOptions: e.target.value,
                    };
                    setProjectSettings(newSettings);
                  }}
                />
              </div>

              {/* Render custom fields */}
              {Object.entries(settings.customFields || {}).map(
                ([fieldName, value]) => (
                  <div key={fieldName}>
                    <label htmlFor={fieldName}>{fieldName}:</label>
                    <input
                      type="text"
                      id={fieldName}
                      value={value}
                      onChange={(e) => {
                        const newSettings = {
                          ...settings,
                          customFields: {
                            ...settings.customFields,
                            [fieldName]: e.target.value,
                          },
                        };
                        setProjectSettings(newSettings);
                      }}
                    />
                  </div>
                )
              )}
              {/* Add custom field */}
              <div>
                <input
                  type="text"
                  placeholder="Field Name"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Field Value"
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                />
                <button onClick={handleAddCustomField}>Add Field</button>
              </div>
              <button onClick={handleSubmit}>Save</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;

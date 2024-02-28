import React, { useEffect, useState } from "react";
import {
  getProjects,
  updateProjectAccess,
  getProjectSettings,
  getProjectByName,
  updateProjectPermissions,
} from "../../helpers/api";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [settings, setProjectSettings] = useState({});
  const [username, setUsername] = useState("");
  const [permissions, setPermissions] = useState("");
  const [permissionsOptions, setPermissionsOptions] = useState([]);

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
      const projectId = await getProjectByName(projectName);
      getProjectSettings(projectId).then((res) => {
        setProjectSettings(res);
        setPermissionsOptions(res.permissionOptions);
      });
    } catch (err) {
      console.error("Error fetching project settings:", err.message);
    }
  };

  const handleProjectAccessChange = async (projectId, accessLevel) => {
    try {
      await updateProjectAccess(projectId, accessLevel);
      console.log("Project access updated successfully!");
    } catch (error) {
      console.error("Error updating project access:", error.message);
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
                <select
                  id="urgency"
                  value={settings.urgency}
                  onChange={(e) => {
                    const newSettings = {
                      ...settings,
                      urgency: e.target.value,
                    };
                    setProjectSettings(newSettings);
                  }}
                >
                  <option value="">Select Urgency</option>
                  {/* Map over urgency options */}
                  {settings.urgencyOptions &&
                    settings.urgencyOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label htmlFor="status">Status:</label>
                <select
                  id="status"
                  value={settings.status}
                  onChange={(e) => {
                    const newSettings = { ...settings, status: e.target.value };
                    setProjectSettings(newSettings);
                  }}
                >
                  <option value="">Select Status</option>
                  {/* Map over status options */}
                  {settings.statusOptions &&
                    settings.statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;

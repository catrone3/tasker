import React, { useEffect, useState } from "react";
import {
  getProjects,
  updateProjectAccess,
  getProjectSettings,
} from "../../helpers/api";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [settings, setProjectSettings] = useState({});

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

  const fetchSettings = async (projectId) => {
    try {
      const projectSettings = await getProjectSettings(projectId);
      setProjectSettings(projectSettings);
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

  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId);
    fetchSettings(projectId);
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
              <select
                onChange={(e) =>
                  handleProjectAccessChange(selectedProject, e.target.value)
                }
              >
                <option value="read">Read</option>
                <option value="write">Write</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;

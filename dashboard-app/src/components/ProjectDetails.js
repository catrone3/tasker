import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";
import { getProject } from "../helpers/api";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const data = fetchProject(projectId);
    setProject(data);
  }, [projectId]);

  const fetchProject = async (projectId) => {
    try {
      const data = getProject(projectId);
      return data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h4">{project.name}</Typography>
      <div>
        {/* Link to KanbanBoard component */}
        <Link to={`/projects/${projectId}/kanban`}>Kanban Board</Link>
      </div>
      <div>
        {/* Link to Backlog component */}
        <Link to={`/projects/${projectId}/backlog`}>Backlog</Link>
      </div>
    </div>
  );
};

export default ProjectDetail;

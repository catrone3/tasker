import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography } from "@mui/material";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // Fetch project details based on projectId
    // You can use this useEffect to fetch project details when projectId changes
    // Update the 'project' state with the fetched project data
  }, [projectId]);

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

// KanbanBoardPage.js
import React from "react";
import { Typography } from "@mui/material";

const KanbanBoardPage = ({ projectId }) => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Kanban Board - Project {projectId}
      </Typography>
      {/* Implement Kanban board component here */}
    </div>
  );
};

export default KanbanBoardPage;

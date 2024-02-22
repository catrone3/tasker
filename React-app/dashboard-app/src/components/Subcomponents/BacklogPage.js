// BacklogPage.js
import React from "react";
import { Typography } from "@mui/material";

const BacklogPage = ({ projectId }) => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Backlog - Project {projectId}
      </Typography>
      {/* Implement backlog component here */}
    </div>
  );
};

export default BacklogPage;

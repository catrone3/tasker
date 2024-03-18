// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

const Sidebar = ({ setOpen }) => {
  const buttonStyle = {
    width: "100%",
    backgroundColor: "#F06449", // Adjust as needed
    color: "#FFFFFF", // Text color
    "&:hover": {
      backgroundColor: "#F06449", // Hover color
    },
  };
  const handleCreateTask = () => {
    setOpen(true);
  };
  return (
    <aside>
      <Button variant="contained" sx={buttonStyle} component={Link} to="/">
        Home
      </Button>
      <Button
        variant="contained"
        sx={buttonStyle}
        component={Link}
        to="/projects"
      >
        Projects
      </Button>
      <div>
        <Button variant="contained" sx={buttonStyle} onClick={handleCreateTask}>
          Create Task
        </Button>
        <Button
          variant="contained"
          sx={buttonStyle}
          component={Link}
          to="/tasks"
        >
          Tasks
        </Button>
        <Button
          variant="contained"
          sx={buttonStyle}
          component={Link}
          to="/settings"
        >
          Settings
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

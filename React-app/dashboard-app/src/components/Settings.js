// SettingsPage.js

import React from "react";
import { Tabs, Tab } from "@mui/material";
import UserRegistrationForm from "./Subcomponents/UserRegistrationForm";
import ProjectCreationForm from "./Subcomponents/ProjectCreationForm";
import ProjectManagement from "./Subcomponents/ProjectManagement";

const Settings = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <div>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Project Management" />
        <Tab label="User Management" />
      </Tabs>
      <div role="tabpanel" hidden={selectedTab !== 1}>
        {selectedTab === 1 && <UserRegistrationForm />}
      </div>
      <div role="tabpanel" hidden={selectedTab !== 0}>
        {selectedTab === 0 && (
          <div>
            <h2>Project Management</h2>
            <ProjectManagement />
            <h2>Create New Project</h2>
            <ProjectCreationForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;

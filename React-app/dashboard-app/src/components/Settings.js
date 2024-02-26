// SettingsPage.js

import React from "react";
import UserRegistrationForm from "./Subcomponents/UserRegistrationForm";
import ProjectCreationForm from "./Subcomponents/ProjectCreationForm";
import ProjectManagement from "./Subcomponents/ProjectManagement";

const Settings = () => {
  return (
    <div>
      <h2>User Registration</h2>
      <UserRegistrationForm />

      <h2>Project Management</h2>
      <ProjectManagement />

      <h2>Create New Project</h2>
      <ProjectCreationForm />
    </div>
  );
};

export default Settings;

// TaskFields.js
import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TaskFields = ({ formData, projectSettings, onChange, onDateChange }) => {
  return (
    <>
      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={onChange}
        fullWidth
      />
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={onChange}
        fullWidth
        multiline
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Due Date"
          value={formData.dueDate}
          onChange={onDateChange}
          fullWidth
          inputFormat="MM/dd/yyyy"
        />
      </LocalizationProvider>
      <TextField
        select
        label="Urgency"
        name="urgency"
        value={formData.urgency ?? ``}
        onChange={onChange}
        fullWidth
        disabled={!projectSettings}
      >
        {projectSettings.urgencyOptions &&
          projectSettings.urgencyOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
      </TextField>
      <TextField
        label="Assigned To"
        name="assignedTo"
        value={formData.assignedTo}
        onChange={onChange}
        fullWidth
      />
      <TextField
        select
        label="Status"
        name="status"
        value={formData.status ?? ``}
        onChange={onChange}
        fullWidth
        disabled={!projectSettings}
      >
        {projectSettings.statusOptions &&
          projectSettings.statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
      </TextField>
    </>
  );
};

export default TaskFields;

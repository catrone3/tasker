import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  // State to store the tasks data
  const [tasks, setTasks] = useState([]);

  // Function to fetch data from the API endpoint
  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/tasks/next");
      setTasks(response.data.tasks); // Assuming the response contains tasks array
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch data from the API endpoint when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <h2>Next Tasks</h2>
      <ul>
        {tasks.map((task, index) => (
          <li key={index}>{task.title}</li> // Adjust this to display relevant task data
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

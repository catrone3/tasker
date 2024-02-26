// api.js
import { jwtDecode } from "jwt-decode";
const BASE_URL = "http://localhost:5000"; // Replace with your backend URL

export const getToken = () => {
  // Function to get JWT token from local storage
  return localStorage.getItem("token");
};

export const isTokenValid = (token) => {
  if (!token) {
    return false;
  }
  const decodedToken = jwtDecode(token); // Decode the token
  const currentTime = Date.now() / 1000; // Get current time in seconds
  const experationTime = decodedToken.exp;
  return currentTime < experationTime;
};

const handleResponse = async (response) => {
  // Helper function to handle API response
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  return response.json();
};

export const loginUser = async (email, password) => {
  // API call to login user and get JWT token
  const payload = JSON.stringify({ email, password });
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  });
  return handleResponse(response);
};

export const getProjectSettings = async (projectId) => {
  const token = getToken();
  const response = await fetch(
    `${BASE_URL}/api/projects/${projectId}/settings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
};

export const getProjects = async () => {
  const token = getToken();
  // Make API request to fetch projects
  const response = await fetch(`${BASE_URL}/api/projects`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }
  const data = await response.json();
  return data;
};

export const getProject = async (projectId) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const getNextTasks = async () => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/api/tasks/next}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

export const createProject = async (name) => {
  const token = getToken();
  const payload = JSON.stringify({ name });
  const response = await fetch(`${BASE_URL}/api/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: payload,
  });
  const data = await response.json();
  return data;
};

export const registerUser = async (username, email, password) => {
  const token = getToken();
  const payload = JSON.stringify({ username, email, password });
  const response = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: payload,
  });
  const data = await response.json();
  return data;
};

export const updateProjectAccess = async (projectName) => {
  const token = getToken();
  const payload = JSON.stringify({ projectName });
  const response = await fetch(`${BASE_URL}/api/users/:id/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: payload,
  });
  const data = await response.json();
  return data;
};

export const putProjectSettings = async (projectId, Settings) => {
  const token = getToken();
  const currentSettings = getProjectSettings(projectId);
  var payload = Settings;
  if (!currentSettings) {
    payload = getProjectSettingsByName("Default");
  }
  const response = await fetch(
    `${BASE_URL}/api/projects/${projectId}/settings`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    }
  );
  const data = await response.json();
  return data;
};

export const getProjectSettingsByName = async (project) => {
  const token = getToken();
  const response = fetch(`${BASE_URL}/api/projects/${project}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data;
};

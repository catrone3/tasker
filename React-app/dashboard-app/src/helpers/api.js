// api.js
import { jwtDecode } from "jwt-decode";
const BASE_URL = "http://localhost:5000"; // Replace with your backend URL

export const getToken = () => {
  // Function to get JWT token from local storage
  return localStorage.getItem("token");
};

export const isTokenValid = async (token) => {
  if (!token) {
    return false;
  }
  const decodedToken = jwtDecode(token); // Decode the token
  const currentTime = Date.now() / 1000; // Get current time in seconds
  const expirationTime = decodedToken.exp;
  const response = await fetch(`${BASE_URL}/api/projects`, {
    headers: {
      Authorization: `Bearer: ${token}`,
    },
  });
  if (response.message === "Invalid Token") {
    return false;
  }
  return currentTime < expirationTime;
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
  try {
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

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
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
  var payload = Settings;
  getProjectSettings(projectId).then((response) => {
    if (response.status === 500) {
      payload = getProjectByName("Default");
      payload._id = projectId;
    }
  });
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

export const getProjectByName = async (project) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/api/projects/name/${project}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.projectId;
};

export const updateProjectPermissions = async (
  projectId,
  username,
  permissions
) => {
  const token = getToken();
  const userId = await findUserId(username);
  console.log(permissions);
  const payload = JSON.stringify({ userId, permissions });
  const response = await fetch(
    `${BASE_URL}/api/projects/${projectId}/permissions`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
    }
  );

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to update project permissions: ${errorMessage}`);
  }
};

export const findUserId = async (username) => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/api/users/${username}/userId`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.userId;
};

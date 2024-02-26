// components/UserRegistrationForm.js

import React, { useState } from "react";
import { registerUser } from "../../helpers/api"; // Assuming you have an API function for user registration

const UserRegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(username, email, password);
      console.log("User registered successfully!");
      // Optionally, you can redirect the user or display a success message
    } catch (error) {
      console.error("Error registering user:", error.message);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default UserRegistrationForm;

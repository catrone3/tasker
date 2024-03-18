// components/UserRegistrationForm.js

import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { registerUser } from "../../helpers/api"; // Assuming you have an API function for user registration

let theme = createTheme({
  // Theme customization goes here as usual, including tonalOffset and/or
  // contrastThreshold as the augmentColor() function relies on these
});

theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    sky: theme.palette.augmentColor({
      color: {
        main: "#5BC3EB",
      },
      name: "sky",
    }),
  },
});

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
    <ThemeProvider theme={theme}>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div>
          <TextField
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            label="Username"
          />
        </div>
        <div>
          <TextField
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
          />
        </div>
        <div>
          <TextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
          />
        </div>
        <div>
          <Button variant="contained" type="submit" color="sky">
            Register
          </Button>
        </div>
      </form>
    </ThemeProvider>
  );
};

export default UserRegistrationForm;

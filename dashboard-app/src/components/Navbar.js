// Navbar.js
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import logo from "../assets/Logo.png";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5BC3EB", // Replace with your desired hex code
    },
  },
});

const Navbar = (isLoggedIn) => {
  return (
    <ThemeProvider theme={theme}>
      <nav>
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="logo mr-2" />
          <h1>Zephyr</h1>
        </div>

        {isLoggedIn && (
          <div className="flex justify-end">
            <Button className="mr-2">Settings</Button>
            <Button className="mr-2">Logout</Button>
          </div>
        )}
      </nav>
    </ThemeProvider>
  );
};

export default Navbar;

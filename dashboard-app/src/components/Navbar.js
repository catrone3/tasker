// Navbar.js
import React, { useState, useEffect } from "react";
import { getProjects } from "../helpers/api";

const Navbar = () => {
  return (
    <nav>
      <h1>Navbar</h1>

      <div className="flex justify-end">
        <button className="mr-2">Settings</button>
        <button className="mr-2">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;

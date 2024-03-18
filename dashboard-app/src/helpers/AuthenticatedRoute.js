// AuthenticatedRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";

const AuthenticatedRoute = ({ element, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      element={isAuthenticated ? element : <Navigate to="/" />}
    />
  );
};

export default AuthenticatedRoute;

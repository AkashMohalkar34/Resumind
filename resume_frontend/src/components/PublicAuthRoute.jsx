import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/ResumeService";

function PublicAuthRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default PublicAuthRoute;

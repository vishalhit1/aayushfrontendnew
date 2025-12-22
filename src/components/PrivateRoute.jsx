import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import DashboardWrapper from "../components/DashboardWrapper.jsx";

const PrivateRoute = ({ children, role }) => {
  const { user } = useContext(AuthContext);

  const doctorInfo = JSON.parse(localStorage.getItem("doctorInfo") || "null");
  const doctorToken = localStorage.getItem("doctorToken");

  const isDoctorLoggedIn = !!doctorInfo && !!doctorToken;

  // Role checking
  if (role === "doctor") {
    if (!isDoctorLoggedIn) return <Navigate to="/doctor/login" replace />;
    return <DashboardWrapper>{children}</DashboardWrapper>;
  }

  if (role === "user") {
    if (!user) return <Navigate to="/" replace />;
    return <DashboardWrapper>{children}</DashboardWrapper>;
  }

  // fallback
  return <Navigate to="/" replace />;
};

export default PrivateRoute;

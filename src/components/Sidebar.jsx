import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/layout.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="mobile-navbar">
        <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
        <h2>Tata 1mg Clone</h2>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">Dashboard</h2>
        <nav>
          <NavLink
            to="/doctors"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setIsOpen(false)}
          >
            Doctors
          </NavLink>
          <NavLink
            to="/lab-tests"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setIsOpen(false)}
          >
            Lab Tests
          </NavLink>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setIsOpen(false)}
          >
            My Bookings
          </NavLink>
          <NavLink
            to="/checkout"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => setIsOpen(false)}
          >
            Checkout
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

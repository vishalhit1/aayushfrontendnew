// import React from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import "../styles/dashboard.css";
// import StickySidebar from "./StickySidebar.jsx";

// const DashboardWrapper = () => {
//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <h2 className="sidebar-logo">1MG Replica</h2>
//         <nav>
//           <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "active" : ""}>
//             Home
//           </NavLink>
//           <NavLink to="/dashboard/doctors" className={({ isActive }) => isActive ? "active" : ""}>
//             Doctors
//           </NavLink>
//           <NavLink to="/dashboard/lab-tests" className={({ isActive }) => isActive ? "active" : ""}>
//             Lab Tests
//           </NavLink>
//           <NavLink to="/dashboard/bookings" className={({ isActive }) => isActive ? "active" : ""}>
//             My Bookings
//           </NavLink>
//           <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? "active" : ""}>
//             Profile
//           </NavLink>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="dashboard-main">
//         <Outlet />
//       </main>

//       {/* Sticky Cart */}
//       <StickySidebar />
//     </div>
//   );
// };

// export default DashboardWrapper;

import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";
import StickySidebar from "../components/StickySidebar.jsx";
import "../styles/dashboard.css";
import Navbar from "./Navbar.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

const DashboardWrapper = ({ children }) => {
  const doctor = JSON.parse(localStorage.getItem("doctorInfo") || "{}");
  const isDoctor = doctor?.role === "doctor";

  return (
    <div className="dashboard">
      <div className="main-content">
        {/* <Navbar /> */}
        {!isDoctor &&
          // <Header />
          <></>
        }
        <div className="page-content">{children}</div>
      </div>
      {/* <StickySidebar /> */}
    </div>
  );
};

export default DashboardWrapper;



import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container, Row, Col, Nav } from "react-bootstrap";
import DoctorProfile from "../components/Doctor/DoctorProfile";
import DoctorAppointments from "../components/Doctor/DoctorAppointments";
import DoctorPatients from "../components/Doctor/DoctorPatients";
import DoctorEarnings from "../components/Doctor/DoctorEarnings";
import DoctorSlots from "../components/Doctor/DoctorSlots";
import DoctorPayouts from "../components/Doctor/DoctorPayouts";
import { API_URL } from "../../config";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { doctorAPI } from "../api/axios";

const socket = io(API_URL);

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "profile";

  console.log("tab", tab);

  const doctordetails = JSON.parse(localStorage.getItem("doctorInfo"));
  const doctorId = doctordetails?._id;

  const [doctorInfo, setDoctorInfo] = useState([])
  const [preview, setPreview] = useState("");

  console.log("doctorInfo",doctorInfo)


  // Sync URL with tab
  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);


 useEffect(() => {
  fetchProfile(doctorId);
  }, [doctorId]);

  const fetchProfile = async () => {
    try {
      const res = await doctorAPI.get(`/api/doctors/${doctorId}`);
      const doctor = res.data.doctor;
      console.log("doctor>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",doctor)
      setDoctorInfo(doctor)
      if (doctor.profileImage?.length > 0) {
        setPreview(
          `${API_URL}/uploads/doctors/${doctor.profileImage[0]?.filename}`
        );
      } else {
        setPreview("");
      }
    } catch {
      console.log("Failed to fetch profile")
      // toast.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    if (!doctorId) return;

    // Join doctor's room
    socket.emit("joinDoctorRoom", doctorId);

    // Listen for booking updates
    socket.on("appointmentUpdate", (data) => {
      toast.info(`Appointment ${data.status}`);
      // fetchAppointments(); // Refresh appointments table
    });

    socket.on("appointmentRescheduled", (data) => {
      toast.info(`Appointment rescheduled to ${data.newDate} ${data.newTime}`);
      // fetchAppointments();
    });

    return () => {
      socket.off("appointmentUpdate");
      socket.off("appointmentRescheduled");
    };
  }, [doctorId]);

  const setTab = (tabName) => {
    setSearchParams({ tab: tabName });
    setActiveTab(tabName);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <DoctorProfile doctorId={doctorId} />;
      case "appointments":
        return <DoctorAppointments doctorId={doctorId} />;
      case "slots":
        return <DoctorSlots doctorId={doctorId} />;
      case "patients":
        return <DoctorPatients doctorId={doctorId} />;
      case "earnings":
        return <DoctorEarnings doctorId={doctorId} />;
      case "payouts":
        return <DoctorPayouts doctorId={doctorId} />;
      default:
        return <p>Select a tab to view content</p>;
    }
  };

  return (
    <>
      <div className="breadcrumb-bar mb-5">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-md-12 col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">
                      <i className="fa fa-home"></i> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item" aria-current="page">
                    User Profile
                  </li>
                  <li className="breadcrumb-item active">{doctorInfo?.name || "Dr. John Doe"}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Container fluid className="mt-4">
        <Row>
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <div className="card p-3">
              {/* Profile Picture */}
              <img
                src={preview || "https://t4.ftcdn.net/jpg/11/28/72/75/360_F_1128727502_ce2UdfqSn42Ia48OeSy7a6UBX590HZnJ.jpg"}
                alt="Doctor Avatar"
                className="rounded-circle mb-2 profile-imagess"
                style={{ width: "140px", height: "140px", objectFit: "cover" }}
              />
              {/* Doctor Info */}
              <div className="user-infos">
                <h5 className="">{doctorInfo?.name || "Dr. John Doe"}</h5>
                <p>{doctorInfo?.email || "doctor@example.com"}</p>
              </div>

              {/* Sidebar Navigation */}
              {[
                { key: "profile", label: "Profile" },
                { key: "appointments", label: "Appointments" },
                { key: "slots", label: "Slot Management" },
                { key: "patients", label: "Patients" },
                { key: "earnings", label: "Earnings" },
                { key: "payouts", label: "Payouts" }
              ].map(item => (
                <div
                  key={item.key}
                  className={`active-sase ${activeTab === item.key ? "active-abds" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setTab(item.key)}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <Col md={9}>{renderContent()}</Col>
        </Row>
      </Container>
    </>
  );
};

export default DoctorDashboard;
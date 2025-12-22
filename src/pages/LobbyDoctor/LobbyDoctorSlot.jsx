import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import StepIndicator from "../../components/StepIndicator";
import "../../styles/lobbyDoctor.css";

const LobbyDoctorSlot = () => {
  const { selectedLobbySlot, setSelectedLobbySlot, consultationType, preferredLanguage } = useContext(CartContext);
  const [currentSlot, setCurrentSlot] = useState(selectedLobbySlot?.slot || "");
  const [selectedDate, setSelectedDate] = useState(
    selectedLobbySlot?.date ? new Date(selectedLobbySlot.date) : new Date()
  );

  const [dates, setDates] = useState([]);
  const [slots, setSlots] = useState([]);
  const slotContainerRef = useRef(null);
  const navigate = useNavigate();

  // Detect if mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const today = new Date();
    const next7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      next7Days.push(date);
    }
    setDates(next7Days);
  
    // 👇 Ensure selectedDate matches one from generated array
    const matchedToday = next7Days.find(
      (d) => d.toDateString() === today.toDateString()
    );
    setSelectedDate(matchedToday || today);



    generateNext7Days();
    generate24HourSlots();
  }, []);

  // Auto-scroll to next available slot after slots are generated
  useEffect(() => {
    if (!slotContainerRef.current) return;

    const slotElements = slotContainerRef.current.querySelectorAll(".slot-button");
    const nextAvailable = Array.from(slotElements).find(
      (btn) => !btn.disabled
    );
    if (nextAvailable) {
      nextAvailable.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [slots, selectedDate]);

  const generateNext7Days = () => {
    const today = new Date();
    const next7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      next7Days.push(date);
    }
    setDates(next7Days);
  };

  const generate24HourSlots = () => {
    const allSlots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        const hour = h % 12 === 0 ? 12 : h % 12;
        const minute = m.toString().padStart(2, "0");
        const ampm = h < 12 ? "AM" : "PM";
        allSlots.push(`${hour}:${minute} ${ampm}`);
      }
    }
    setSlots(allSlots);
  };

  const formatTab = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

    const isToday = (date) => {
      const now = new Date();
      return now.toDateString() === date.toDateString();
    };
    

  const isSlotDisabled = (slot) => {
    if (!isToday(selectedDate)) return false;
    const [time, ampm] = slot.split(" ");
    let [hour, minute] = time.split(":").map(Number);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    const now = new Date();
    return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute);
  };

  const handleContinue = () => {
    const dayName = selectedDate
    .toLocaleDateString("en-US", { weekday: "short" }); // e.g. "Fri"
  console.log("dayName",dayName)
    setSelectedLobbySlot({ 
      slot: currentSlot, 
      date: selectedDate,
      day: dayName,
    });
    navigate("/lobby-doctor/checkout");
  };

  return (
    <>
      <div className="breadcrumb-bar">
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
                    Consult Doctor
                  </li>
                  <li className="breadcrumb-item">Select Category</li>
                  <li className="breadcrumb-item ">Select Language and Type</li>
                  <li className="breadcrumb-item ">Select Patient</li>
                  <li className="breadcrumb-item active">Select Slot</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-4 lobby-slot-page">
        <StepIndicator currentStep={4} />
        <div className="selection-abcd">
          <div className="select-medical-category">
            <h3>Select Appointment Slot</h3>
          </div>

          {/* Calendar Tabs / Dropdown */}
          {isMobile ? (
            <div className="calendar-dropdown">
              <select
              className="select-abcds-appointement form-select"
                value={selectedDate.toDateString()}
                onChange={e => {
                  const newDate = dates.find(
                    date => date.toDateString() === e.target.value
                  );
                  if (newDate) setSelectedDate(newDate);
                }}
              >
                {dates.map((date, idx) => (
                  <option key={idx} value={date.toDateString()}>
                    {formatTab(date)}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="calendar-tabs">
              {dates.map((date, idx) => (
                <div
                  key={idx}
                  className={`tab ${selectedDate.toDateString() === date.toDateString() ? "active" : ""} ${isToday(date) ? "today" : ""}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {formatTab(date)}
                </div>
              ))}
            </div>
          )}

          {/* Scrollable Slot Buttons */}
          <div className="slot-list scrollable" ref={slotContainerRef}>
            {slots.map((slot, idx) => (
              <button
                key={idx}
                className={`slot-button ${currentSlot === slot ? "selected" : ""}`}
                onClick={() => setCurrentSlot(slot)}
                disabled={isSlotDisabled(slot)}
              >
                {slot}
              </button>
            ))}
          </div>

          <div className="action-buttons mt-5">
            <button className="go-backs" onClick={() => navigate(-1)}>
              <i className="fa fa-chevron-left"></i> Back
            </button>
            <button className="continue-abcd"
              disabled={!currentSlot}
              onClick={handleContinue}>
              Continue <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LobbyDoctorSlot;

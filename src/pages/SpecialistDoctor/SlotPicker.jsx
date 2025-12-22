import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../api/axios";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";
import '../../styles/slotPicker.css'

const SlotPicker = () => {
  const { id } = useParams(); // doctor ID
  const navigate = useNavigate();
  const { selectedSpecialistSlot, setSelectedSpecialistSlot } = useContext(CartContext);

  const [slots, setSlots] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(selectedSpecialistSlot?.date ? new Date(selectedSpecialistSlot.date) : new Date());
  const [currentSlot, setCurrentSlot] = useState(selectedSpecialistSlot?.slot || "");
  const slotContainerRef = useRef(null);

  // Detect if mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch slots
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await API.get(`/api/doctors/${id}/slots`);
        setSlots(res.data.slots || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch slots");
      }
    };
    fetchSlots();
    generateNext7Days();
  }, [id]);

  // Generate next 7 days for calendar
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

  // Auto-scroll to next available slot
  useEffect(() => {
    if (!slotContainerRef.current) return;
    const slotElements = slotContainerRef.current.querySelectorAll(".slot-button");
    const nextAvailable = Array.from(slotElements).find(btn => !btn.disabled);
    if (nextAvailable) {
      nextAvailable.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [slots, selectedDate]);

  // Format tab
  const formatTab = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

  const isToday = (date) => new Date().toDateString() === date.toDateString();

  // Disable past slots for today
  const isSlotDisabled = (slot) => {
    if (!isToday(selectedDate)) return !slot.available;
    const [hour, minute] = slot.time.split(":").map(Number);
    const now = new Date();
    return now.getHours() > hour || (now.getHours() === hour && now.getMinutes() >= minute) || !slot.available;
  };

  // Slots filtered by selected date
  const slotsForSelectedDate = slots.filter(s => s.date === selectedDate.toLocaleDateString("en-US", { weekday: "short" }));

  const handleContinue = () => {
    if (!currentSlot) return toast.error("Please select a slot");
    setSelectedSpecialistSlot({ date: selectedDate, slot: currentSlot });
    navigate("/doctor/preference"); // same flow as lobby doctor
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
                  <li className="breadcrumb-item">Specialist</li>
                  <li className="breadcrumb-item active">Select Slot</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-4">
        <div className="selection-abcd">
          <div className="select-medical-category">
            <h3>Select Slot</h3>
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

          <div className="slot-list scrollable" ref={slotContainerRef}>
            {slotsForSelectedDate.length === 0 ? (
              <p>No slots available</p>
            ) : (
              slotsForSelectedDate.map((slot) => (
                <button
                  key={slot._id}
                  className={`slot-button ${currentSlot._id === slot._id ? "selected" : ""}`}
                  disabled={isSlotDisabled(slot)}
                  onClick={() => setCurrentSlot(slot)}
                >
                  {slot.time}
                </button>
              ))
            )}
          </div>

          {/* Continue Button */}
          <div className="action-buttons mt-5">
            <button className="go-backs" onClick={() => navigate(-1)}>
              <i className="fa fa-chevron-left"></i> Go Back
            </button>
            <button
              className="continue-abcd"
              disabled={!currentSlot} onClick={handleContinue}
            >
              Continue <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlotPicker;

import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const LabTestSlot = () => {
  const { totalAmount, selectedLabSlot, setSelectedLabSlot } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedTests = [] } = location.state || {};

  const [currentSlot, setCurrentSlot] = useState(selectedLabSlot?.slot || "");
  const [selectedDate, setSelectedDate] = useState(
    selectedLabSlot?.date ? new Date(selectedLabSlot.date) : new Date()
  );

  const [dates, setDates] = useState([]);
  const [slots, setSlots] = useState([]);

  const slotContainerRef = useRef(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate 7 days + slot ranges
  useEffect(() => {
    generateNext7Days();
    generateHourlyRangeSlots();
  }, []);

  useEffect(() => {
    if (!slotContainerRef.current) return;

    const slotElements = slotContainerRef.current.querySelectorAll(".slot-button");
    const nextAvailable = Array.from(slotElements).find((btn) => !btn.disabled);

    if (nextAvailable) {
      nextAvailable.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [slots, selectedDate]);

  // Generate 7 days
  const generateNext7Days = () => {
    const today = new Date();
    const arr = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }

    setDates(arr);

    // Correct selected date
    const match = arr.find((d) => d.toDateString() === today.toDateString());
    setSelectedDate(match || today);
  };

  // ⭐ NEW: Hourly range slots 6 AM – 10 PM
  const generateHourlyRangeSlots = () => {
    let ranges = [];

    for (let h = 6; h <= 21; h++) {
      const startHour = h;
      const endHour = h + 1;

      const format = (hr) => {
        const ampm = hr >= 12 ? "PM" : "AM";
        const twelveHr = hr % 12 === 0 ? 12 : hr % 12;
        return `${twelveHr} ${ampm}`;
      };

      ranges.push(`${format(startHour)} - ${format(endHour)}`);
    }

    setSlots(ranges);
  };

  const formatTab = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

  const isToday = (date) => {
    const now = new Date();
    return now.toDateString() === date.toDateString();
  };

  // Disable past time slots for today
  const isSlotDisabled = (slot) => {
    if (!isToday(selectedDate)) return false;

    const [start] = slot.split(" - ");

    let [hour, ampm] = start.split(" ");
    hour = parseInt(hour);

    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    const now = new Date();
    return now.getHours() >= hour;
  };

  const handleContinue = () => {
    if (!currentSlot) return alert("Please select a time slot before continuing.");

    setSelectedLabSlot({ slot: currentSlot, date: selectedDate });

    navigate("/lab/checkout", {
      state: {
        selectedTests,
        totalAmount,
        date: selectedDate,
        slot: currentSlot,
      },
    });
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
                    Lab Test
                  </li>
                  <li className="breadcrumb-item active">Select Slot</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5 mb-5">
        <div className="selection-abcd">
          <div className="select-medical-category">
            <h3>Select Slot</h3>
          </div>
          <div className="slot-card">
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

            {/* Slot Selection Grid */}
            <div className="slot-list scrollable" ref={slotContainerRef}>
              {slots.map((slot, idx) => (
                <button
                  key={idx}
                  className={`slot-button ${currentSlot === slot ? "selected" : ""}`}
                  onClick={() => {
                    setCurrentSlot(slot);
                    setSelectedLabSlot({ slot, date: selectedDate });
                  }}
                  disabled={isSlotDisabled(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="slot-end-new">
          <div className="slot-summary-details">
            <p><span>Date:</span> {selectedDate.toDateString()}</p>
            <p><span>Slot:</span> {selectedLabSlot?.slot || "Not selected"}</p>
          </div>
          {/* Action Buttons */}
          <div className="action-buttons mt-4">
            <button className="go-backs" onClick={() => navigate('/labtest-address-detail')}>
              <i className="fa fa-chevron-left"></i> Back
            </button>
            <button
              className="continue-abcd"
              disabled={!currentSlot}
              onClick={handleContinue}
            >
              Continue <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LabTestSlot;
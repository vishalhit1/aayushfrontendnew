import React, { useContext, useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
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
  /* ===================== MOBILE ===================== */
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  /* ===================== INIT ===================== */
  useEffect(() => {
    generateNext7Days();
    generateMorningSlots();
  }, []);
  useEffect(() => {
    if (!slotContainerRef.current) return;
    // Scroll to first available slot
    const firstAvailable = slotContainerRef.current.querySelector(".slot-button:not(:disabled)");
    firstAvailable?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [slots, selectedDate]);
  /* ===================== HELPER ===================== */
  // ✅ CRITICAL: Check if ALL slots are disabled for current date
  const allSlotsDisabled = useCallback(() => {
    return slots.every(slot => isSlotDisabled(slot));
  }, [slots, selectedDate]);
  // ✅ Check if slot selection is valid
  const isSlotSelectionValid = () => {
    return !!currentSlot && !allSlotsDisabled();
  };
  /* ===================== DATE LOGIC ===================== */
  const generateNext7Days = () => {
    const today = new Date();
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    setDates(arr);
    // If after 7 PM → auto move to next day
    if (today.getHours() >= 19) {
      setSelectedDate(arr[1]);
    } else {
      setSelectedDate(arr[0]);
    }
  };
  const isToday = (date) => new Date().toDateString() === date.toDateString();
  const isDateDisabled = (date) => {
    const now = new Date();
    return now.getHours() >= 19 && isToday(date);
  };
  /* ===================== SLOT LOGIC ===================== */
  const generateMorningSlots = () => {
    const ranges = [];
    for (let h = 6; h < 13; h++) {
      const format = (hr) => {
        const ampm = hr >= 12 ? "PM" : "AM";
        const twelve = hr % 12 === 0 ? 12 : hr % 12;
        return `${twelve} ${ampm}`;
      };
      ranges.push(`${format(h)} - ${format(h + 1)}`);
    }
    setSlots(ranges);
  };
  const isSlotDisabled = (slot) => {
    if (!isToday(selectedDate)) return false;
    const [start] = slot.split(" - ");
    let [hour, ampm] = start.split(" ");
    hour = parseInt(hour);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return new Date().getHours() >= hour;
  };
  /* ===================== ACTION ===================== */
  const handleContinue = () => {
    if (!currentSlot) {
      toast.error("Please select a slot");
      return;
    }
    if (allSlotsDisabled()) {
      toast.error("No slots available for today. Please select another date.");
      return;
    }
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
  const formatTab = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  /* ===================== UI ===================== */
  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container text-center">
          <nav className="page-breadcrumb">
            <ol className="breadcrumb justify-content-center">
              <li className="breadcrumb-item">
                <Link to="/">
                  <i className="fa fa-home"></i> Home
                </Link>
              </li>
              <li className="breadcrumb-item">Lab Test</li>
              <li className="breadcrumb-item active">Select Slot</li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="container mt-5 mb-5">
        <h3>Select Slot</h3>
        {/* DATE SELECTOR */}
        {isMobile ? (
          <select
            className="form-select mb-4"
            value={selectedDate.toDateString()}
            onChange={(e) => {
              const d = dates.find((x) => x.toDateString() === e.target.value);
              if (d && !isDateDisabled(d)) {
                setSelectedDate(d);
                setCurrentSlot("");
              }
            }}
          >
            {dates.map((d, i) => (
              <option
                key={i}
                value={d.toDateString()}
                disabled={isDateDisabled(d)}
              >
                {formatTab(d)}
              </option>
            ))}
          </select>
        ) : (
          <div className="calendar-tabs mb-4">
            {dates.map((d, i) => (
              <div
                key={i}
                className={`tab me-2 px-3 py-2 rounded ${
                  selectedDate.toDateString() === d.toDateString() ? "active" : ""
                } ${isDateDisabled(d) ? "disabled bg-secondary text-white" : ""}`}
                onClick={() => {
                  if (!isDateDisabled(d)) {
                    setSelectedDate(d);
                    setCurrentSlot("");
                  }
                }}
              >
                {formatTab(d)}
              </div>
            ))}
          </div>
        )}
        {/* SLOTS */}
        <div className="slot-list scrollable mb-4" ref={slotContainerRef}>
          {slots.map((slot, i) => (
            <button
              key={i}
              className={`slot-button me-2 mb-2 px-4 py-2 rounded ${
                currentSlot === slot 
                  ? "selected bg-success text-white" 
                  : isSlotDisabled(slot)
                  ? "disabled bg-secondary text-white-50" 
                  : "bg-light border hover-bg-primary"
              }`}
              disabled={isSlotDisabled(slot)}
              onClick={() => {
                if (!isSlotDisabled(slot)) {
                  setCurrentSlot(slot);
                  setSelectedLabSlot({ slot, date: selectedDate });
                }
              }}
            >
              {slot}
              {currentSlot === slot && " ✓"}
            </button>
          ))}
        </div>
        {/* ✅ STATUS MESSAGE */}
        {allSlotsDisabled() && (
          <div className="alert alert-warning text-center mb-3">
            <i className="fas fa-clock me-2"></i>
            No slots available for today. Please select another date or try tomorrow.
          </div>
        )}
        {currentSlot && !allSlotsDisabled() && (
          <div className="alert alert-success text-center mb-3">
            <i className="fas fa-check-circle me-2"></i>
            Slot selected: <strong>{currentSlot}</strong> on {selectedDate.toDateString()}
          </div>
        )}
        {/* FOOTER */}
        <div className="slot-end-new">
          <div className="row text-center mb-4">
            <div className="col-md-6">
              <p><strong>Date:</strong></p>
              <h5 className="text-primary">{selectedDate.toDateString()}</h5>
            </div>
            <div className="col-md-6">
              <p><strong>Slot:</strong></p>
              <h5 className={currentSlot ? "text-success" : "text-muted"}>
                {currentSlot || "Not selected"}
              </h5>
            </div>
          </div>
          <div className="action-buttons">
            <button
              className="go-backs me-3"
              onClick={() => navigate("/labtest-address-detail")}
            >
              ← Back
            </button>
            <button
              className="continue-abcd"
              disabled={!isSlotSelectionValid()}
              onClick={handleContinue}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default LabTestSlot;
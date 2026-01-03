import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CartContext } from "../context/CartContext";

const LabTestSlot = () => {
  const { totalAmount, selectedLabSlot, setSelectedLabSlot } =
    useContext(CartContext);

  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTests = [] } = location.state || {};

  const [currentSlot, setCurrentSlot] = useState(
    selectedLabSlot?.slot || ""
  );

  const [selectedDate, setSelectedDate] = useState(null);
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

  /* ===================== SCROLL ===================== */
  useEffect(() => {
    if (!slotContainerRef.current) return;
    slotContainerRef.current
      .querySelector(".slot-button")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [slots, selectedDate]);

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

  // ✅ FUTURE DATES ONLY → NEVER DISABLE SLOTS
  const isSlotDisabled = () => false;

  const allSlotsDisabled = useCallback(() => false, []);

  /* ===================== DATE GENERATION ===================== */
  const generateNext7Days = () => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 1); // ✅ ALWAYS TOMORROW

    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      arr.push(d);
    }

    setDates(arr);
    setSelectedDate(arr[0]); // ✅ Jan 4 (correct)
  };

  /* ===================== ACTION ===================== */
  const handleContinue = () => {
    if (!currentSlot) {
      toast.error("Please select a slot");
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
            value={selectedDate?.toDateString()}
            onChange={(e) => {
              const d = dates.find(
                (x) => x.toDateString() === e.target.value
              );
              if (d) {
                setSelectedDate(d);
                setCurrentSlot("");
              }
            }}
          >
            {dates.map((d, i) => (
              <option key={i} value={d.toDateString()}>
                {formatTab(d)}
              </option>
            ))}
          </select>
        ) : (
          <div className="calendar-tabs mb-4">
            {dates.map((d, i) => (
              <div
                key={i}
                className={`tab ${
                  selectedDate?.toDateString() === d.toDateString()
                    ? "active"
                    : ""
                }`}
                onClick={() => {
                  setSelectedDate(d);
                  setCurrentSlot("");
                }}
              >
                {formatTab(d)}
              </div>
            ))}
          </div>
        )}

        {/* SLOTS */}
        <div className="slot-list" ref={slotContainerRef}>
          {slots.map((slot, i) => (
            <button
              key={i}
              className={`slot-button ${
                currentSlot === slot ? "selected" : ""
              }`}
              onClick={() => {
                setCurrentSlot(slot);
                setSelectedLabSlot({ slot, date: selectedDate });
              }}
            >
              {slot}
              {currentSlot === slot && " ✓"}
            </button>
          ))}
        </div>

        <div className="action-buttons mt-4">
          <button
            className="go-backs"
            onClick={() => navigate("/labtest-address-detail")}
          >
            ← Back
          </button>

          <button
            className="continue-abcd"
            disabled={!currentSlot}
            onClick={handleContinue}
          >
            Continue →
          </button>
        </div>
      </div>
    </>
  );
};

export default LabTestSlot;
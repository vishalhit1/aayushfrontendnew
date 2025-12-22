import React, { useEffect, useState } from "react";
import API from "../../../api/axios";
import "../../../styles/nextupcomingbooking.css";

const NextUpcomingBooking = () => {
  const [nextBooking, setNextBooking] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [remaining, setRemaining] = useState("");

  // Fetch upcoming bookings
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await API.get("/api/booking/next-upcoming");

        if (res.data.success) {
          setNextBooking(res.data.nextBooking);  // single booking
          setAllBookings(res.data.allUpcoming);  // list
        }
      } catch (err) {
        console.error("Error fetching next booking", err);
      }
    };

    fetchBooking();
  }, []);

  // Countdown Timer Logic
  useEffect(() => {
    if (!nextBooking) return;

    const timer = setInterval(() => {
      const slotDateTime = new Date(nextBooking.slotDateTime);
      const now = new Date();
      const diff = slotDateTime - now;

      if (diff <= 0) {
        setRemaining("Starting now");
        return;
      }

      const diffSeconds = Math.floor(diff / 1000);
      const diffMinutes = Math.floor(diff / (1000 * 60));
      const diffHours = Math.floor(diff / (1000 * 60 * 60));
      const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        const remainingHours = diffHours - diffDays * 24;
        setRemaining(`${diffDays}d ${remainingHours}h`);
        return;
      }

      if (diffHours > 0) {
        const remainingMinutes = diffMinutes - diffHours * 60;
        setRemaining(`${diffHours}h ${remainingMinutes}m`);
        return;
      }

      if (diffMinutes > 0) {
        const remainingSeconds = diffSeconds - diffMinutes * 60;
        setRemaining(`${diffMinutes}m ${remainingSeconds}s`);
        return;
      }

      setRemaining(`${diffSeconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextBooking]);

  if (!nextBooking) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      weekday: "short",
    });
  };

  return (
    <>
      {/* MAIN UPCOMING CONSULTATION CARD */}
      <div className="next-booking-card deluxe-card">
        <div className="doctor-header">
          <div>
            <h4 className="nb-title">Upcoming Consultation</h4>

            <p className="nb-doctor-name">
              Doctor Name:{" "}
              {nextBooking.type === "lobby"
                ? nextBooking?.lobbyDoctor?.name
                : nextBooking?.doctors?.name}
            </p>

            <p className="nb-doctor-name">
              Patient Name: {nextBooking?.patient?.name}
            </p>
          </div>
        </div>

        <div className="nb-details wide-details">
          <div className="detail-box">
            <span className="label">📅 Date</span>
            <span className="value">
              {formatDate(nextBooking.slot?.date)}
            </span>
          </div>

          <div className="detail-box">
            <span className="label">⏰ Time</span>
            <span className="value">{nextBooking.slot?.startTime}</span>
          </div>
        </div>

        <div className="countdown-section">
          <h5 className="countdown-title">Starts In</h5>

          <div className="countdown-grid">
            {remaining.split(" ").map((item, i) => (
              <div key={i} className="count-block">
                <div className="count-number">{item}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => (window.location.href = "/bookings")}
          className="nb-btn shiny-btn"
        >
          View / Join Consultation
        </button>
      </div>

      {/* MULTIPLE UPCOMING BOOKINGS LIST */}
      {allBookings.length > 1 && (
        <div className="multiple-booking-container">
          <h3 className="more-title">More Upcoming Bookings</h3>

          {allBookings.map((b, index) => (
            <div key={index} className="mini-booking-card">
              <div className="mini-left">
                <p className="mini-date">{formatDate(b.slot?.date)}</p>
                <p className="mini-time">{b.slot?.startTime}</p>
              </div>

              <div className="mini-right">
                <p className="mini-doctor">
                  {b.type === "lobby"
                    ? b?.lobbyDoctor?.name
                    : b?.doctors?.name}
                </p>
                <p className="mini-patient">{b?.patient?.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default NextUpcomingBooking;

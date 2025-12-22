import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { doctorAPI } from "../../api/axios";

const DoctorBookings = ({ doctorId }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await doctorAPI.get(`/api/doctors/${doctorId}/bookings`);
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [doctorId]);

  return (
    <div>
      <h3>My Bookings</h3>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, idx) => (
            <tr key={idx}>
              <td>{b.patientName}</td>
              <td>{b.date}</td>
              <td>{b.time}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DoctorBookings;

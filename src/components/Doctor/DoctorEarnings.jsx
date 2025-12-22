import React, { useEffect, useState } from "react";
import { doctorAPI } from "../../api/axios";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";

const DoctorEarnings = ({ doctorId }) => {
  const [monthlyBreakdown, setMonthlyBreakdown] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchEarnings();
  }, [doctorId]);

  const fetchEarnings = async () => {
    try {
      const res = await doctorAPI.get(`/api/doctors/${doctorId}/earnings`);
      setMonthlyBreakdown(res.data.monthlyBreakdown);
      setTotalEarnings(res.data.totalEarnings);
    } catch (err) {
      console.log(err)
      // toast.error("Failed to fetch earnings");
    }
  };

  return (
    <div>
      <div className="profilecobntent">
        <h3>Earnings</h3>
      </div>
      <div className="mb-3">
        <p>Total Earnings: <strong>₹{totalEarnings}</strong></p>
      </div>
      <div className="form-data-abcd">
        <Table bordered hover>
          <thead>
            <tr>
              <th>Month</th>
              <th>Bookings</th>
              <th>Earnings</th>
            </tr>
          </thead>
          <tbody>
            {monthlyBreakdown.map((m, idx) => (
              <tr key={idx}>
                <td>{m.month}</td>
                <td>{m.bookingsCount}</td>
                <td>₹{m.monthlyEarnings}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorEarnings;

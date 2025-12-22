import React, { useState, useEffect } from "react";
import { doctorAPI } from "../../api/axios";
import { Table, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const DoctorPayouts = ({ doctorId }) => {
  const [payouts, setPayouts] = useState([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("bank");
  const [accountDetails, setAccountDetails] = useState({ accountNumber: "", ifsc: "", upiId: "" });

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const res = await doctorAPI.get(`/api/doctors/${doctorId}/payouts`);
      setPayouts(res.data.payouts);
    } catch (err) {
      console.error(err);
      // toast.error("Failed to fetch payouts");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let details = method === "bank"
        ? { accountNumber: accountDetails.accountNumber, ifsc: accountDetails.ifsc }
        : { upiId: accountDetails.upiId };

      await doctorAPI.post(`/api/doctors/${doctorId}/payouts`, { amount, method, accountDetails: details });
      toast.success("Payout requested successfully");
      setAmount("");
      setAccountDetails({ accountNumber: "", ifsc: "", upiId: "" });
      fetchPayouts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to request payout");
    }
  };

  return (
    <div>
      <div className="profilecobntent">
        <h3>Request Payout</h3>
      </div>
      <div className="form-data-abcd">
        <Form onSubmit={handleSubmit} className="mb-4">
          <Form.Group className="mb-2">
            <Form.Label>Amount (₹)</Form.Label>
            <Form.Control type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Method</Form.Label>
            <Form.Select value={method} onChange={e => setMethod(e.target.value)}>
              <option value="bank">Bank Transfer</option>
              <option value="upi">UPI</option>
            </Form.Select>
          </Form.Group>

          {method === "bank" && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Account Number</Form.Label>
                <Form.Control type="text" value={accountDetails.accountNumber} onChange={e => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>IFSC</Form.Label>
                <Form.Control type="text" value={accountDetails.ifsc} onChange={e => setAccountDetails({ ...accountDetails, ifsc: e.target.value })} required />
              </Form.Group>
            </>
          )}

          {method === "upi" && (
            <Form.Group className="mb-2">
              <Form.Label>UPI ID</Form.Label>
              <Form.Control type="text" value={accountDetails.upiId} onChange={e => setAccountDetails({ ...accountDetails, upiId: e.target.value })} required />
            </Form.Group>
          )}

          <button className="request-payoutds" type="submit">Request Payout</button>
        </Form>
      </div>
      <div className="profilecobntent">
        <h3>Payout History</h3>
      </div>
      <div className="form-data-abcd">
        <Table bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p._id}>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>₹{p.amount}</td>
                <td>{p.method.toUpperCase()}</td>
                <td>{p.status.charAt(0).toUpperCase() + p.status.slice(1)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorPayouts;

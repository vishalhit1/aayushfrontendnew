import React, { useContext, useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Modal, Card, Button, Form } from "react-bootstrap";
import io from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL);

const Checkout = () => {
  const { labCart, doctorCart, removeFromLabCart, removeFromDoctorCart, selectedAddress, setSelectedAddress, selectedPatient, setSelectedPatient } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [redeemCoins, setRedeemCoins] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const navigate = useNavigate();
  const userCoins = 280;
  const redeemableValue = 50;

  const cart = [...labCart, ...doctorCart];
  const labTotal = labCart.reduce((sum, item) => sum + item.price, 0);
  const doctorTotal = doctorCart.reduce((sum, item) => sum + item.fee, 0);
  const totalCart = labTotal + doctorTotal;
  const totalToPay = Math.max(totalCart - (appliedCoupon?.discount || 0) - (redeemCoins ? redeemableValue : 0), 0);

  useEffect(() => {
    socket.on("paymentUpdated", (payment) => console.log("Payment updated:", payment));
    socket.on("walletUpdated", (wallet) => console.log("Wallet updated:", wallet));
    return () => { socket.off("paymentUpdated"); socket.off("walletUpdated"); };
  }, []);

  const handleConfirmBooking = async () => {
    if (!selectedAddress || !selectedPatient) { toast.error("Select patient and address"); return; }
    try {
      const res = await API.post("/api/checkout/book", {
        doctors: doctorCart.map(i => i._id),
        labTests: labCart.map(i => i._id),
        totalAmount: totalToPay,
        paymentMethod,
        address: selectedAddress,
        patient: selectedPatient,
        appliedCoupon: appliedCoupon?.code,
        coinsRedeemed: redeemCoins ? redeemableValue : 0
      });
      toast.success("Booking confirmed!");
      cart.forEach(item => item.fee ? removeFromDoctorCart(item._id) : removeFromLabCart(item._id));
      navigate("/");
    } catch { toast.error("Booking failed"); }
  };
  

  return (
    <div className="container my-4">
      <h2>Checkout</h2>
      <div className="row">
        {/* Left - Cart & Summary */}
        <div className="col-md-8">
          <Card className="mb-3 p-3">
            <h5>Patient & Address</h5>
            <div className="d-flex justify-content-between">
            <div>
                <strong>Doctor:</strong> {selectedDoctor?.name || "Not selected"} <Button size="sm" onClick={() => setShowPatientModal(true)}>Select</Button>
              </div>
              <div>
                <strong>Patient:</strong> {selectedPatient?.name || "Not selected"} <Button size="sm" onClick={() => setShowPatientModal(true)}>Select</Button>
              </div>
              <div>
                <strong>Address:</strong> {selectedAddress?.flatNo || "Not selected"} <Button size="sm" onClick={() => setShowAddressModal(true)}>Select</Button>
              </div>
            </div>
          </Card>

          <Card className="mb-3 p-3">
            <h5>Cart Items</h5>
            {cart.map(item => (
              <div key={item._id} className="d-flex justify-content-between mb-2">
                <div>{item.name || item.name}</div>
                <div>₹{item.price || item.fee}</div>
                <Button size="sm" variant="danger" onClick={() => item.fee ? removeFromDoctorCart(item._id) : removeFromLabCart(item._id)}>Remove</Button>
              </div>
            ))}
          </Card>
        </div>

        {/* Right - Summary */}
        <div className="col-md-4">
          <Card className="p-3">
            <h5>Bill Summary</h5>
            <div className="d-flex justify-content-between"><span>Lab Tests</span><span>₹{labTotal}</span></div>
            <div className="d-flex justify-content-between"><span>Doctor Fees</span><span>₹{doctorTotal}</span></div>
            {appliedCoupon && <div className="d-flex justify-content-between text-success"><span>Coupon {appliedCoupon.code}</span><span>-₹{appliedCoupon.discount}</span></div>}
            {redeemCoins && <div className="d-flex justify-content-between text-success"><span>Coins Redeemed</span><span>-₹{redeemableValue}</span></div>}
            <hr />
            <div className="d-flex justify-content-between"><strong>Total to Pay</strong><strong>₹{totalToPay}</strong></div>

            <Form.Group className="my-2">
              <Form.Check type="radio" label="Cash on Delivery" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              <Form.Check type="radio" label="Online Payment" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
            </Form.Group>

            <Form.Group className="my-2">
              <Form.Check type="checkbox" label={`Redeem ${redeemableValue} NeuCoins`} checked={redeemCoins} onChange={() => setRedeemCoins(!redeemCoins)} />
              <small>Balance: {userCoins} NeuCoins</small>
            </Form.Group>

            <Button className="w-100 mt-2" onClick={handleConfirmBooking}>
              {paymentMethod === "cod" ? "Confirm Booking (COD)" : "Pay Online & Confirm"}
            </Button>
          </Card>
        </div>
      </div>

      {/* Modals for Patient & Address */}
      <Modal show={showPatientModal} onHide={() => setShowPatientModal(false)}><Modal.Header closeButton><Modal.Title>Select Patient</Modal.Title></Modal.Header></Modal>
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}><Modal.Header closeButton><Modal.Title>Select Address</Modal.Title></Modal.Header></Modal>
    </div>
  );
};

export default Checkout;

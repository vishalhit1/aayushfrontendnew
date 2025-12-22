// src/pages/LobbyDoctor/LobbyDoctorCheckout.jsx
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import StepIndicator from "../../components/StepIndicator";
import { load } from "@cashfreepayments/cashfree-js";
import { Modal, Button } from "react-bootstrap";
import '../../styles/LobbyDoctorCheckout.css';

const LobbyDoctorCheckout = () => {
  const {
    selectedPatient,
    selectedCategory,
    selectedLobbySlot,
    selectedAddress,
    preferredLanguage,
    consultationType,
    totalAmount,
    getLobbyDoctorBookingPayload,
    removeFromDoctorCart,
  } = useContext(CartContext);

  const [categories, setCategories] = useState([]);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const openCouponModal = () => setShowCouponModal(true);
  const closeCouponModal = () => setShowCouponModal(false);

  // Fetch doctor coupons for this user
  const fetchCoupons = async () => {
    try {
      const res = await API.get(`/api/coupons?type=doctor&userId=${selectedPatient?._id}`);
      if (res.data.success) setAvailableCoupons(res.data.coupons);
    } catch (err) {
      console.error("Error fetching doctor coupons:", err);
    }
  };

  // Apply selected coupon
  const applyCoupon = async (code) => {
    try {
      if (!code) return toast.info("Enter a coupon code first");

      const userId = selectedPatient?._id || localStorage.getItem("userId");
      const { data } = await API.post("/api/coupons/validate", {
        code,
        userId,
        type: "doctor",
        totalAmount, // send current totalAmount for min order check
      });

      if (!data.success) return toast.error(data.message);

      setAppliedCoupon(data.coupon);
      setDiscount(data.discount);
      toast.success(`${data.coupon.code} applied! -₹${data.discount.toFixed(2)}`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Coupon not valid");
    }
  };



  console.log("discount", discount)

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    toast.info("Coupon removed");
  };

  // Load coupons on page load
  useEffect(() => {
    if (selectedPatient?._id) fetchCoupons();
  }, [selectedPatient]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/category/getActiveCategories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching categories");
    }
  };


  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentSessionId, setPaymentSessionId] = useState(null);

  // Load Cashfree SDK
  useEffect(() => {
    const scriptId = "cashfree-js";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://sdk.cashfree.com/js/ui/2.0.0/cashfree.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  
  // Construct payload
  // Construct payload
  const getPayload = () => {
    const baseAmount = Number(totalAmount || 0);
    const appliedDiscount = Number(discount || 0);
    const subtotal = Math.max(baseAmount - appliedDiscount, 0);
    const gst = subtotal * 0.18;
    const finalTotal = subtotal + gst;

    return {
      ...getLobbyDoctorBookingPayload(),
      patient: selectedPatient || {},
      slot: {
        slotId: selectedLobbySlot._id || null,
        date: selectedLobbySlot?.date,
        startTime: selectedLobbySlot?.slot,
        endTime: null,
        day:selectedLobbySlot?.day,
      } || {},
      preferredLanguage: preferredLanguage.length ? preferredLanguage : ["English"],
      consultationType: consultationType || "Audio",
      totalAmount: finalTotal, // ✅ send discounted + GST amount to backend
      email: selectedPatient?.email || "user@example.com",
      type: "lobby",
      doctors: null,
      category: getLobbyDoctorBookingPayload().category || "General Practitioner",
      userId: selectedPatient?._id,
      couponCode: appliedCoupon?.code || null,
      coupon: appliedCoupon?._id || null
    };
  };


  // Create order
  const createOrder = async () => {
    const payload = getPayload();

    console.log("payload", payload)

    if (!payload.patient?._id || !payload.slot?.date || !payload.address?.flatNo) {
      toast.error("Please select patient, slot, and address");
      return null;
    }

    try {
      console.log("🧩 Creating order with payload:", payload);

      const { data } = await API.post("/api/payment/create-order", {
        totalAmount: payload.totalAmount,
        currency: "INR",
        customer_id: payload.patient._id,
        customer_email: payload.patient.email,
        customer_phone: payload.patient.phone || "9999999999",
      });

      console.log("🧩 Order created:", data);

      if (!data?.order?.payment_session_id) {
        toast.error("Failed to create payment order");
        return null;
      }

      setOrderId(data.order.order_id);
      setPaymentSessionId(data.order.payment_session_id);

      return data.order;
    } catch (err) {
      console.error("❌ Error creating order:", err.response?.data || err);
      toast.error("Unable to create payment order");
      return null;
    }
  };

  // Verify payment
  const verifyPayment = async (order_id) => {
    try {
      const payload = getPayload();
      payload.order_id = order_id;

      console.log("🧩 verifyPayment payload:", payload);

      const res = await API.post("/api/payment/verify-payment", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Booking confirmed:", res.data);
      toast.success("Doctor appointment booked successfully!");
      removeFromDoctorCart("lobby-doctor");
      navigate(`/payment-success?order_id=${order_id}`);
    } catch (err) {
      console.error("❌ Booking verification failed:", err.response?.data || err);
      toast.error("Booking verification failed after payment");
    }
  };

  // Handle full payment flow
  // ...imports remain the same

  const handlePayment = async () => {
    const payload = getPayload();
    console.log("🧩 Payload before creating order:", payload);
    // return false;
    setLoading(true);

    try {
      const { data } = await API.post("/api/payment/create-order", payload);

      if (!data?.order?.payment_session_id) {
        toast.error("Failed to create payment order");
        setLoading(false);
        return;
      }

      const cashfree = await load({ mode: "sandbox" });
      await cashfree.checkout({
        paymentSessionId: data.order.payment_session_id,
        redirectTarget: "_self",
        onSuccess: async (orderDetails) => {
          console.log("✅ Payment success:", orderDetails);
          try {
            const res = await API.post("/api/payment/verify-payment", { order_id: orderDetails.order.order_id });
            console.log("✅ Booking confirmed:", res.data);
            toast.success("Doctor appointment booked successfully!");
            removeFromDoctorCart("lobby-doctor");
            navigate(`/payment-success?order_id=${orderDetails.order.order_id}`);
          } catch (err) {
            console.error("❌ Booking verification failed:", err.response?.data || err);
            toast.error("Booking verification failed after payment");
          }
        },
        onFailure: (err) => {
          console.error("❌ Payment failed:", err);
          toast.error("Payment failed. Please try again.");
        },
      });
    } catch (err) {
      console.error("❌ Payment initiation error:", err.response?.data || err);
      toast.error("Unable to initiate payment");
    } finally {
      setLoading(false);
    }
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
                  <li className="breadcrumb-item">Select Slot</li>
                  <li className="breadcrumb-item active">Payment Booking</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>


      <div className="container my-4">
        <StepIndicator currentStep={6} />
        <div className="selection-abcd">
          <div className="select-medical-category">
            <h3>Confirm & Pay for Lobby Doctor Booking</h3>
          </div>
          <div className="booking-card">
            <div className="card-header">
              <h2>Confirm Your Booking Details!</h2>
              <p>Your consultation details</p>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="info-row col-lg-6">
                  <div className="icon-wrapper">
                    <i className="fas fa-user" />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Patient Name</div>
                    <div className="info-value">{selectedPatient?.name}</div>
                  </div>
                </div>
                <div className="info-row col-lg-6">
                  <div className="icon-wrapper">
                    <i className="fas fa-stethoscope" />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Doctor Category</div>
                    <div className="info-value">{categories.find(val => val._id == selectedCategory)?.name || "-"}</div>
                  </div>
                </div>
                <div className="info-row col-lg-6">
                  <div className="icon-wrapper">
                    <i className="fas fa-clock" />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Appointment Time</div>
                    <div className="info-value">{selectedLobbySlot?.slot} on{" "}
                      {selectedLobbySlot?.date ? new Date(selectedLobbySlot.date).toLocaleDateString() : "-"}</div>
                  </div>
                </div>
                {/* <div className="info-row col-lg-6">
                  <div className="icon-wrapper">
                    <i className="fas fa-map-marker-alt" />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Address</div>
                    <div className="info-value">
                      {selectedAddress?.flatNo}, {selectedAddress?.street}, {selectedAddress?.city}
                    </div>
                  </div>
                </div> */}
                <div className="info-row col-lg-6">
                  <div className="icon-wrapper">
                    <i className="fas fa-language" />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Preferred Language</div>
                    <div className="info-value">{preferredLanguage?.map(val => val.name)?.join(", ")}</div>
                  </div>
                </div>
                <div className="info-row col-lg-6">
                  <div className="icon-wrapper">
                    <i className="fas fa-phone-alt" />
                  </div>
                  <div className="info-content">
                    <div className="info-label">Consultation Type</div>
                    <div className="info-value">{consultationType}</div>
                  </div>
                </div>
              </div>
              <div className="divider" />
              <div className="amount-section">
                {/* Coupon Section */}
                {/* <div className="border rounded p-3 mt-4">
                  <h6 className="fw-bold mb-3">Have a Coupon?</h6>

                  {!appliedCoupon ? (
                    <>
                      <div className="d-flex mb-2">
                        <select
                          className="form-select me-2"
                          onChange={(e) => applyCoupon(e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select Coupon
                          </option>
                          {availableCoupons.map((coupon) => (
                            <option key={coupon._id} value={coupon.code}>
                              {coupon.code} — {coupon.description}
                            </option>
                          ))}
                        </select>
                        <button className="btn btn-primary" onClick={() => fetchCoupons()}>
                          Refresh
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-success">
                        Applied Coupon: <strong>{appliedCoupon.code}</strong> (-₹{discount})
                      </span>
                      <button className="btn btn-link text-danger" onClick={removeCoupon}>
                        Remove
                      </button>
                    </div>
                  )}
                </div> */}





                {/* ========================= Bill Summary ========================= */}
                <div className="border rounded p-4 mt-4 shadow-sm bg-white bill-summary">
                  <h5 className="fw-bold mb-3 text-primary">
                    <i className="fa fa-file-invoice me-2 text-info"></i> Bill Summary

                    {/* ========================= Coupon Section ========================= */}
                    <div className="mb-3">
                      {appliedCoupon ? (
                        <div className="d-flex justify-content-between align-items-center p-2 bg-success bg-opacity-10 rounded">
                          <span className="text-success fw-semibold">
                            Applied Coupon: <strong>{appliedCoupon.code}</strong> (−₹{discount.toFixed(2)})
                          </span>
                          <button className="btn btn-link text-danger p-0" onClick={removeCoupon}>
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-outline-primary w-100" onClick={openCouponModal}>
                          <i className="fa fa-tag me-2"></i> Apply Coupon
                        </button>
                      )}
                    </div>
                  </h5>

                  {(() => {
                    const baseAmount = Number(totalAmount || 0);
                    const appliedDiscount = Number(discount || 0);

                    // Subtotal after discount
                    const subtotal = Math.max(baseAmount - appliedDiscount, 0); // prevent negative

                    // GST 18%
                    const gst = subtotal * 0.18;
                    const cgst = gst / 2;
                    const sgst = gst / 2;
                    const finalTotal = subtotal + gst;

                    return (
                      <>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Consultation Fee</span>
                          <span>₹{baseAmount.toFixed(2)}</span>
                        </div>

                        {appliedDiscount > 0 && (
                          <div className="d-flex justify-content-between text-success mb-2">
                            <span>
                              Discount {appliedCoupon?.code && `(${appliedCoupon.code})`}
                            </span>
                            <span>−₹{appliedDiscount.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="d-flex justify-content-between mb-2">
                          <span>CGST (9%)</span>
                          <span>₹{cgst.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>SGST (9%)</span>
                          <span>₹{sgst.toFixed(2)}</span>
                        </div>

                        <hr className="my-2" />
                        <div className="d-flex fw-bold fs-5 text-dark">
                          <span>Total Payable</span>
                          <span className="ms-auto text-primary">₹{finalTotal.toFixed(2)}</span>
                        </div>

                        {/* Optional: Add a small note about GST and discounts */}
                        <p className="mt-2 text-muted small">
                          * GST included. Discounts applied via coupon.
                        </p>
                      </>
                    );
                  })()}
                </div>



              </div>
            </div>
          </div>


          <div className="action-buttons mt-5">
            <button className="go-backs" onClick={() => navigate(-1)} disabled={loading}>
              <i className="fa fa-chevron-left"></i> Go Back
            </button>
            <button className="continue-abcd" onClick={handlePayment} disabled={loading}>
              {loading ? "Processing..." : "Pay Now"} <i className="fa fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>



      <Modal show={showCouponModal} onHide={closeCouponModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-tag me-2 text-success"></i> Apply Coupon
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Manual Entry */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="form-control"
              id="modalCouponInput"
            />
            <button
              className="btn btn-primary mt-2 w-100"
              onClick={() => {
                const code = document.getElementById("modalCouponInput").value.trim();
                if (code) applyCoupon(code);
                else toast.info("Enter a coupon code first");
                closeCouponModal();
              }}
            >
              Apply
            </button>
          </div>

          {/* Available Coupons */}
          {availableCoupons.length > 0 && (
            <div>
              <label className="form-label small text-muted">Available Coupons:</label>
              <select
                className="form-select"
                defaultValue=""
                onChange={(e) => {
                  applyCoupon(e.target.value);
                  closeCouponModal();
                }}
              >
                <option value="" disabled>Select coupon</option>
                {availableCoupons.map((coupon) => (
                  <option key={coupon._id} value={coupon.code}>
                    {coupon.code} — {coupon.description}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeCouponModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default LobbyDoctorCheckout;

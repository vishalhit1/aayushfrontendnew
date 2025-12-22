// src/pages/LobbyDoctor/DoctorCheckout.jsx
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import { load } from "@cashfreepayments/cashfree-js";
import { Modal, Button } from "react-bootstrap";
import "../../styles/LobbyDoctorCheckout.css"; // reuse the same CSS

const DoctorCheckout = () => {
  const {
    selectedDoctorName,
    selectedDoctor,
    selectedPatient,
    selectedSpecialistSlot,
    preferredLanguage,
    consultationType,
    totalAmount,
    getSpecialistDoctorBookingPayload,
    removeFromDoctorCart,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [showCouponModal, setShowCouponModal] = useState(false);

  const openCouponModal = () => setShowCouponModal(true);
  const closeCouponModal = () => setShowCouponModal(false);

  const fetchCoupons = async () => {
    try {
      const res = await API.get(`/api/coupons?type=doctor&userId=${selectedPatient?._id}`);
      if (res.data.success) setAvailableCoupons(res.data.coupons);
    } catch (err) {
      console.error("Error fetching doctor coupons:", err);
    }
  };

  useEffect(() => {
    if (selectedPatient?._id) fetchCoupons();
  }, [selectedPatient]);

  const applyCoupon = async (code) => {
    try {
      const userId = selectedPatient?._id || localStorage.getItem("userId");
      const { data } = await API.post("/api/coupons/validate", {
        code,
        userId,
        type: "doctor",
      });

      if (!data.success) return toast.error(data.message || "Invalid coupon");

      const { coupon } = data;
      let discountAmt = 0;

      if (coupon.discountType === "flat") discountAmt = coupon.discountValue;
      else discountAmt = (totalAmount * coupon.discountValue) / 100;

      if (coupon.maxDiscount && discountAmt > coupon.maxDiscount)
        discountAmt = coupon.maxDiscount;

      setAppliedCoupon(coupon);
      setDiscount(discountAmt);
      toast.success(`${coupon.code} applied!`);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Coupon not valid");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    toast.info("Coupon removed");
  };

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

  const getPayload = () => {
    const baseAmount = Number(totalAmount || 0);
    const appliedDiscount = Number(discount || 0);
    const subtotal = baseAmount - appliedDiscount;
    const gst = subtotal * 0.18;
    const finalTotal = subtotal + gst;

    return {
      ...getSpecialistDoctorBookingPayload(),
      doctors: selectedDoctor || null,
      patient: selectedPatient || {},
      slot: {
        slotId: selectedSpecialistSlot?.slot._id,
        date: selectedSpecialistSlot?.date,
        startTime: selectedSpecialistSlot?.slot?.time,
        endTime: null,
      } || {},
      preferredLanguage: preferredLanguage.length ? preferredLanguage : null,
      consultationType: consultationType || "Audio",
      totalAmount: finalTotal,
      email: selectedPatient?.email || "user@example.com",
      type: "specialist",
      userId: selectedPatient?._id || "guest_" + Date.now(),
      couponCode: appliedCoupon?.code || null,
      coupon: appliedCoupon?._id || null,
    };
  };

  const handlePayment = async () => {
    const payload = getPayload();

    if (!payload.patient || !payload.slot) {
      toast.error("Please select patient and slot");
      return;
    }

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
          try {
            await API.post("/api/payment/verify-payment", {
              ...payload,
              order_id: orderDetails.order.order_id,
            });
            toast.success("Doctor appointment booked successfully!");
            removeFromDoctorCart("specialist-doctor");
            navigate(`/payment-success?order_id=${orderDetails.order.order_id}`);
          } catch (err) {
            console.error("Booking verification failed:", err.response?.data || err);
            toast.error("Booking failed after payment");
          }
        },
        onFailure: (err) => {
          console.error("Payment failed:", err);
          toast.error("Payment failed. Please try again.");
        },
      });
    } catch (err) {
      console.error("Payment initiation failed:", err.response?.data || err);
      toast.error("Unable to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const baseAmount = Number(totalAmount || 0);
  const appliedDiscount = Number(discount || 0);
  const subtotal = baseAmount - appliedDiscount;
  const gst = subtotal * 0.18;
  const cgst = gst / 2;
  const sgst = gst / 2;
  const finalTotal = subtotal + gst;

  return (
    <>
      <div className="breadcrumb-bar">
        <div className="container">
          <div className="row align-items-center inner-banner">
            <div className="col-12 text-center">
              <nav aria-label="breadcrumb" className="page-breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/"><i className="fa fa-home"></i> Home</Link>
                  </li>
                  <li className="breadcrumb-item">Consult Doctor</li>
                  <li className="breadcrumb-item">Specialist Doctor</li>
                  <li className="breadcrumb-item active">Payment Booking</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-4">
        <div className="selection-abcd">
          <div className="select-medical-category">
            <h3>Confirm & Pay for Specialist Doctor Booking</h3>
          </div>

          <div className="booking-card">
            <div className="card-header">
              <h2>Confirm Your Booking Details!</h2>
              <p>Your consultation details</p>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="info-row col-lg-6">
                  <div className="icon-wrapper"><i className="fas fa-user" /></div>
                  <div className="info-content">
                    <div className="info-label">Doctor Name</div>
                    <div className="info-value">{selectedDoctorName}</div>
                  </div>
                  <div className="info-content mt-2">
                    <div className="info-label">Patient Name</div>
                    <div className="info-value">{selectedPatient?.name}</div>
                  </div>
                </div>
                <div className="info-row col-lg-6">
                  <div className="icon-wrapper"><i className="fas fa-clock" /></div>
                  <div className="info-content">
                    <div className="info-label">Appointment Time</div>
                    <div className="info-value">
                      {selectedSpecialistSlot?.slot?.time} on {selectedSpecialistSlot?.date ? new Date(selectedSpecialistSlot.date).toLocaleDateString() : "-"}
                    </div>
                  </div>
                </div>
                <div className="info-row col-lg-6 mt-3">
                  <div className="icon-wrapper"><i className="fas fa-phone-alt" /></div>
                  <div className="info-content">
                    <div className="info-label">Consultation Type</div>
                    <div className="info-value">{consultationType}</div>
                  </div>
                </div>
              </div>

              <div className="divider" />

              {/* Coupon Section */}
              <div className="border rounded p-4 mt-4 shadow-sm bg-white">
                <h5 className="fw-bold mb-3 text-primary">
                  <i className="fa fa-tag me-2 text-success"></i> Apply Coupon
                </h5>

                {!appliedCoupon ? (
                  <>
                    <button className="btn btn-outline-primary w-100" onClick={openCouponModal}>
                      <i className="fa fa-tag me-2"></i> Apply Coupon
                    </button>
                  </>
                ) : (
                  <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                    <span className="text-success fw-semibold">
                      Applied Coupon: <strong>{appliedCoupon.code}</strong> (−₹{discount.toFixed(2)})
                    </span>
                    <button className="btn btn-link text-danger p-0" onClick={removeCoupon}>
                      <i className="fa fa-times"></i> Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Bill Summary */}
              <div className="border rounded p-4 mt-4 shadow-sm bg-white bill-summary">
                <h5 className="fw-bold mb-3 text-primary">
                  <i className="fa fa-file-invoice me-2 text-info"></i> Bill Summary
                </h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Consultation Fee</span>
                  <span>₹{baseAmount.toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="d-flex justify-content-between text-success mb-2">
                    <span>Discount ({appliedCoupon?.code})</span>
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
                <div className="d-flex justify-content-between fw-bold fs-5 text-dark">
                  <span>Total Payable</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
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
        </div>
      </div>

      {/* Coupon Modal */}
      <Modal show={showCouponModal} onHide={closeCouponModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fa fa-tag me-2 text-success"></i> Apply Coupon
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <input type="text" placeholder="Enter coupon code" className="form-control" id="modalCouponInput" />
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

export default DoctorCheckout;

import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Button, Modal, Form, Spinner, Accordion, Container } from "react-bootstrap";
import API from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import { API_URL } from "../../config";
import LoginModal from "../components/LoginModal";
import { AuthContext } from "../context/AuthContext";

import diabtes from "../assets/diabetes.png"
import assignmember from "../assets/icons/assignmember.png";
import nocart from "../assets/nocart.gif";
import printss from "../assets/printss.gif";
import patientadds from "../assets/patientadds.png";
import coupons from "../assets/coupons.png";
import selectpat from "../assets/selectpat.png";

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const {
    labCart,
    removeFromLabCart,
    selectedPatient,
    selectedAddress,
    selectedLabSlot,
    appliedCoupon, setAppliedCoupon,
    discount, setDiscount,
    addonSelected, setAddonSelected
  } = useContext(CartContext);

  const [loginOpen, setLoginOpen] = useState(false);

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingPatient, setAddingPatient] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState(() => {
    const saved = localStorage.getItem("selectedPatientsPerTest");
    return saved ? JSON.parse(saved) : {};
  });

  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTest, setActiveTest] = useState(null);

  // 💰 Coupon logic
  const [showCoupons, setShowCoupons] = useState(false);
  const [manualCode, setManualCode] = useState("");
  // const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [redeemCoins, setRedeemCoins] = useState(false);
  const [userCoins] = useState(50); // example
  const [redeemableValue] = useState(20);
  // const [isValueAddon, setIsValueAddon] = useState(false);
  // const [addonSelected, setAddonSelected] = useState(false);

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [specificCoupons, setSpecificCoupons] = useState([]);
  // const [discount, setDiscount] = useState(0);

  const userId = JSON.parse(localStorage.getItem('user'))?.id


  // 🧾 Fetch patients
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/api/users/patients");
      if (data.success) setPatients(data.patients);
    } catch (err) {
      console.log(err)
      // toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const { data } = await API.get(`/api/coupons/getAvailableCoupons?type=lab&userId=${userId}`);
      if (data.success) setAvailableCoupons(data.coupons); setSpecificCoupons(data.specific)
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchCoupons();
  }, []);

  // Calculate total
  // const labTotal = labCart.reduce((sum, t) => sum + Number(t.price || 0), 0);
  // const totalToPay = labTotal - (appliedCoupon?.discount || 0);

  // --- ADD-ON ---
  const VALUE_ADDON_PRICE = 100;

  const allPatients = Object.values(selectedPatients).flat();

  // Deduplicate by patient._id
  const uniquePatients = [
    ...new Map(allPatients.map((p) => [p._id, p])).values(),
  ];

  const patientCount = uniquePatients.length || 0;

  const valueAddOnTotal = addonSelected
    ? VALUE_ADDON_PRICE * patientCount
    : 0;

  const SLOT_FIXING_THRESHOLD = 499;
  const SLOT_FIXING_CHARGE = 200;

  // --- LAB TEST TOTAL ---
  // const labTotal = labCart.reduce((sum, test) => {
  //   const assignedCount = selectedPatients[test._id]?.length || 0;
  //   return sum + Number(test.price || 0) * assignedCount;
  // }, 0);

  const labTotal = labCart.reduce((sum, test) => {
    const assignedCount = selectedPatients[test._id]?.length;
    // If no patient selected yet, assume 1 for display purpose
    const countForPrice = assignedCount && assignedCount > 0 ? assignedCount : 1;
    return sum + Number(test.price || 0) * countForPrice;
  }, 0);

  // Automatic slot fixing charge if subtotal < ₹499
  const slotCharge = labTotal > 0 && labTotal < SLOT_FIXING_THRESHOLD ? SLOT_FIXING_CHARGE : 0;

  // Grand total including slot charge
  const grandTotal = labTotal + valueAddOnTotal + slotCharge - discount;


  // const totalToPay = labTotal - (appliedCoupon?.discount || 0);

  // Define configurable tax rate (can come from backend or context)
  const TAX_RATE = 18; // in percentage (e.g. 18 for 18%)

  const taxAmount = (labTotal * TAX_RATE) / 100;
  const cgst = taxAmount / 2;
  const sgst = taxAmount / 2;
  // const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const totalToPay = labTotal + cgst + sgst - discount;


  // Coupon apply
  // const applyCoupon = (code, discount) => {
  //   setAppliedCoupon({ code, discount });
  //   toast.success(`${code} applied!`);
  // };

  // ✅ Coupon apply (real-time validation)
  const applyCoupon = async (code) => {
    if (!userId) {
      setLoginOpen(true);
      return;
    }

    // prevent reapplying same coupon
    if (appliedCoupon?.code === code) {
      return toast.info("Coupon already applied");
    }

    try {
      const { data } = await API.post("/api/coupons/validate", {
        code,
        userId,
        type: "lab",
      });

      if (!data.success) return toast.error(data.message || "Invalid coupon");

      const { coupon } = data;
      let discountAmt = 0;
      if (coupon.discountType === "flat") discountAmt = coupon.discountValue;
      else discountAmt = (labTotal * coupon.discountValue) / 100;

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

  // 🧍‍♂️ Open Select modal
  const handleSelectPatients = (testId) => {

    if (!user) {
      setLoginOpen(true);
      return;
    }


    setActiveTest(testId);
    setShowSelectModal(true);
  };

  // ➕ Open Add Patient Modal
  const handleOpenAddModal = () => {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    setShowSelectModal(false);


    setEditingPatient(null);
    setPatientForm({
      name: "",
      gender: "",
      age: "",
      relation: "",
      medical_history: "",
      allergies: "",
      prescription: [],
    });
    setShowAddModal(true);
  };

  // ✏️ Open Edit Patient Modal
  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setPatientForm({
      name: patient.name,
      gender: patient.gender,
      age: patient.age,
      relation: patient.relation,
      medical_history: patient.medical_history,
      allergies: patient.allergies,
      prescription: patient.prescription || [],
    });
    setShowSelectModal(false);
    setShowAddModal(true);
  };

  // ✅ Patient form
  const [patientForm, setPatientForm] = useState({
    name: "",
    gender: "",
    age: "",
    relation: "",
    medical_history: "",
    allergies: "",
    prescription: [],
  });

  // ✅ Save (Add/Edit)
  const handleSavePatient = async (e) => {
    e.preventDefault();
    if (!patientForm.name || !patientForm.gender || !patientForm.age)
      return toast.error("Please fill all required fields");

    try {
      setAddingPatient(true);
      const formData = new FormData();
      Object.entries(patientForm).forEach(([key, value]) => {
        if (key === "prescription" && value.length > 0) {
          value.forEach((file) => formData.append("prescription", file));
        } else formData.append(key, value);
      });

      if (editingPatient) {
        const { data } = await API.patch(
          `/api/users/patient/${editingPatient._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (data.success) {
          toast.success("Patient updated successfully!");
          setPatients((prev) =>
            prev.map((p) => (p._id === editingPatient._id ? data.patient : p))
          );
        }
      } else {
        const { data } = await API.post("/api/users/patient", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (data.success) {
          toast.success("Patient added successfully!");
          setPatients((prev) => [...prev, data.patient]);
        }
      }

      setShowAddModal(false);
    } catch (err) {
      toast.error("Failed to save patient");
    } finally {
      setAddingPatient(false);
    }
  };

  // ✅ Toggle selection per test
  const togglePatientSelection = (testId, patient) => {
    setSelectedPatients((prev) => {
      const prevList = prev[testId] || [];
      const exists = prevList.find((p) => p._id === patient._id);
      let updated;
      if (exists) updated = prevList.filter((p) => p._id !== patient._id);
      else updated = [...prevList, patient];
      const newState = { ...prev, [testId]: updated };
      localStorage.setItem("selectedPatientsPerTest", JSON.stringify(newState));
      return newState;
    });
  };

  // ❌ Remove patient from test
  const handleRemovePatient = (testId, patientId) => {
    setSelectedPatients((prev) => {
      const updated = {
        ...prev,
        [testId]: (prev[testId] || []).filter((p) => p._id !== patientId),
      };
      localStorage.setItem("selectedPatientsPerTest", JSON.stringify(updated));
      return updated;
    });

  };

  // const handleContinue = () => {
  //   if (!user) {
  //     setLoginOpen(true);
  //     return;
  //   }

  //   console.log("selectedPatients", selectedPatients)
  //   console.log("selectedAddress", selectedAddress)
  //   console.log("selectedLabSlot", selectedLabSlot)

  //   if (!selectedPatients)
  //     return toast.error("Please select a patient before continuing.");

  //   if (!selectedAddress) {
  //     navigate("/labtest-address-detail");
  //     return;
  //   }
  //   if (!selectedLabSlot) {
  //     navigate("/lab/slot");
  //     toast.info("Please select a lab slot before proceeding!");
  //     return;
  //   }
  //   // Both patient and address are selected, proceed to payment
  //   proceedToPayment();
  // };

  const handleContinue = () => {
    if (!user) {
      setLoginOpen(true); // Opens login modal if not logged in
      return;
    }

    if (!selectedPatients || Object.keys(selectedPatients).length === 0) {
      toast.error("Please select at least one patient before continuing.");
      return;
    }

    // NEW FIXED VALIDATION
    const unassignedTests = labCart.filter(item => {
      const patients = selectedPatients[item._id];
      return !patients || patients.length === 0;
    });

    if (unassignedTests.length > 0) {
      toast.error("Please assign patients to all selected tests before continuing.");
      return;
    }

    // Navigate to address selection
    navigate("/labtest-address-detail");
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


  const proceedToPayment = async () => {
    if (!selectedAddress || !selectedLabSlot) {
      toast.error("Please select address and time slot");
      return;
    }

    // 1️⃣ Build testsWithPatients payload (from selectedPatients)
    const testsWithPatients = Object.entries(selectedPatients).map(
      ([testId, patients]) => ({
        testId,
        patients: patients.map((p) => ({
          patientId: p._id,
          name: p.name,
          gender: p.gender,
          age: p.age,
          relation: p.relation,
          medicalHistory: p.medical_history || "",
          allergies: p.allergies || "",
          prescription: p.prescription || [],
        })),
      })
    );

    if (!testsWithPatients.length) {
      toast.error("No patients selected for any test");
      return;
    }

    // 2️⃣ Calculate tax breakup
    const cgst = +(labTotal * 0.09).toFixed(2);
    const sgst = +(labTotal * 0.09).toFixed(2);
    const igst = 0;

    // 3️⃣ Prepare payload for your API
    const payload = {
      testsWithPatients,
      address: selectedAddress,
      slot: selectedLabSlot,
      totalAmount: totalToPay,
      taxBreakup: { cgst, sgst, igst },
      couponCode: appliedCoupon?.code || null,
      coupon: appliedCoupon?._id || null
    };

    console.log("🧾 Sending to createLabTestOrder API:", payload);

    // return false;

    try {
      // :one: Create lab order
      const { data } = await API.post("/api/payment/create-lab-order", payload);
      console.log("data>>>>>>>>>>>>>>>>>>>>>>>", data)
      if (!data?.order?.payment_session_id) {
        toast.error("Failed to create payment order");
        setLoading(false);
        return;
      }
      // :two: Initialize Cashfree checkout
      const cashfree = await load({ mode: "sandbox" }); // production in prod
      await cashfree.checkout({
        paymentSessionId: data.order.payment_session_id,
        redirectTarget: "_self",
        onSuccess: async (orderDetails) => {
          try {
            // :three: Verify lab payment
            await API.post("/api/payment/verify-lab-payment", {
              order_id: orderDetails.order.order_id,
            });
            toast.success("Lab booking confirmed!");
            removeFromLabCart();
            window.location.href = `/lab-payment-success?order_id=${orderDetails.order.order_id}`;
          } catch (err) {
            console.error(err);
            toast.error("Booking failed after payment");
          }
        },
        onFailure: (err) => {
          console.error("Cashfree payment failed:", err);
          toast.error("Payment failed");
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  const selfExists = patients.some(
    (p) => p.relation === "Self" && p._id !== editingPatient?._id
  );


  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* LEFT: Tests + Patients */}
        <div className={labCart.length === 0 ? "col-lg-12 no-cart-needed" : "col-lg-8"}>
          {(labCart.length === 0) ? (
            <div className="when-no-cart">
              <img src={nocart} alt="Empty Cart" />
              <h5>No lab tests added</h5>
              <p>
                Everything you need for your health all in one place.
              </p>
              <button
                className="add-new-lab-test-cart"
                onClick={() => navigate("/lab-tests")}
              >
                + Add Lab Test
              </button>
            </div>
          ) : (
            <>
              <h3 className="trotal-jnsj">
                Total Lab Tests
                <span>
                  ( {labCart.length} {labCart.length === 1 ? "Item" : "Items"} )
                </span>
              </h3>
              {labCart.map((test) => (
                <div key={test._id} className="total-letst-lshn">
                  <div>
                    <div className="d-flex align-items-center padd-checkout">
                      <img className="img-ajbjbn" src={diabtes} alt="" />
                      <div className="d-block name-paln-check">
                        <h5>{test.name}</h5>
                        {test.tier && (
                          <h6>{test.tier}</h6>
                        )}
                      </div>
                      <p className="check-price-out">
                        ₹{test.price}/- <br />
                        <span> ₹{test.actualPrice}/-</span>
                      </p>
                      <div
                        className="trash-check-cart"
                        onClick={() => removeFromLabCart(test._id)}
                      >
                        <i className="fa fa-trash"></i>
                      </div>
                    </div>
                    <hr className="checkout-hres" />
                    <div className="padd-checkout pb-2">
                      <div className="assign-member-checkout">
                        <h4>
                          <img src={assignmember} className="new-check-images" alt="" />
                          Assigned Members
                          {(selectedPatients[test._id] && selectedPatients[test._id].length > 0) && (
                            <i
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleSelectPatients(test._id)}
                              className="fa fa-edit"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title="Add Assigned Members"
                            >
                            </i>
                          )}
                        </h4>
                        <div className="d-flex gap-2">
                          {(selectedPatients[test._id] || []).length === 0 ? (
                            <button
                              className="select-patient-checkoutsas"
                              onClick={() => handleSelectPatients(test._id)}
                            >
                              <img src={selectpat} alt="" /> Select Patients
                            </button>
                          ) : (
                            (selectedPatients[test._id] || []).map((p) => (
                              <div
                                key={p._id}
                                className="d-flex align-items-center pat-list-check"
                              >
                                {p.name}
                                <button
                                  onClick={() =>
                                    handleRemovePatient(test._id, p._id)
                                  }
                                  className="btn-close checkout-sloce"
                                ></button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Show summary ONLY if user is logged in AND cart has items */}
        {labCart.length > 0 && (
          <div className="col-lg-4">

            <div className="apply-new-coupons cart-pages-aas mb-4">
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <img className="asasawqwqw" src={coupons} alt="Coupons" />
                    <span className="coupon-title">Apply Coupons</span>
                  </Accordion.Header>

                  <Accordion.Body>
                    {/* MANUAL COUPON INPUT */}
                    <div className="d-flex coupons-abdsx mb-3">
                      <input
                        className="custom-coupon-input1232"
                        placeholder="Enter custom coupon"
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                      />
                      <button
                        className="apply-coupon-btn-new"
                        onClick={() => {
                          if (!manualCode.trim())
                            return toast.error("Enter coupon code");
                          applyCoupon(manualCode.trim());
                          setManualCode("");
                        }}
                      >
                        Apply
                      </button>
                    </div>

                    {/* APPLIED COUPON BANNER */}
                    {appliedCoupon && (
                      <div className="applied-coupon-card p-3 mb-3 d-flex align-items-center justify-content-between">

                        <div className="d-flex align-items-center gap-3">
                          {/* Applied Badge */}
                          <div className="applied-badge">APPLIED</div>

                          {/* Coupon Details */}
                          <div>
                            <div className="applied-discount">
                              {appliedCoupon.discountType === "percentage"
                                ? `${appliedCoupon.discountValue}% OFF`
                                : `₹${appliedCoupon.discountValue} OFF`}
                            </div>

                            <div className="applied-code">{appliedCoupon.code}</div>
                          </div>
                        </div>

                        {/* Remove */}
                        <button className="remove-coupon-btn" onClick={removeCoupon}>
                          Remove
                        </button>
                      </div>
                    )}


                    {/* FEATURED SINGLE COUPON (OPTIONAL) */}
                    {specificCoupons.length > 0 && (
                      <div className="custom-coupon">
                        <div className="coupon-card mx-auto my-4"
                          onClick={() => applyCoupon(availableCoupons[0].code)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="coupon-left">
                            <h5>Coupon</h5>
                          </div>

                          <div className="coupon-content">
                            <div className="coupon-title">
                              {availableCoupons[0].discountType === "percentage"
                                ? `Flat ${availableCoupons[0].discountValue}% off*`
                                : `Flat ₹${availableCoupons[0].discountValue} off*`}
                            </div>

                            <div className="coupon-code">{availableCoupons[0].code}</div>

                            {/* <div className="coupon-desc">
                              Save on all transactions
                            </div> */}
                          </div>
                        </div>
                      </div>
                    )}

                    <h4 className="choose-or-abcdsaas mt-3">
                      OR Choose from available
                    </h4>

                    {/* SELECT COUPON DROPDOWN */}
                    <div className="form-new-coupons">
                      <select
                        name="coupons"
                        className="form-select"
                        onChange={(e) => {
                          if (e.target.value !== "Select Coupon") {
                            applyCoupon(e.target.value);
                          }
                        }}
                      >
                        <option hidden value="Select Coupon">
                          Select Coupon
                        </option>

                        {availableCoupons.map((c) => (
                          <option key={c._id} value={c.code}>
                            {c.code} –{" "}
                            {c.discountType === "percentage"
                              ? `${c.discountValue}%`
                              : `₹${c.discountValue}`}{" "}
                            OFF
                          </option>
                        ))}
                      </select>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>


            <div className="value-add-ons">
              <div className="first-blocks d-flex">
                <img src={printss} alt="" />
                <div className="d-block">
                  <h3>Value add - ons</h3>
                  <p>Amplify your experience with these additional services</p>
                </div>
              </div>
              <div className="sec-blocks d-flex">
                <Form.Check
                  type="checkbox"
                  style={{ marginRight: "12px" }}
                  checked={addonSelected}
                  onChange={(e) => {
                    const value = e.target.checked;
                    setAddonSelected(value);
                    localStorage.setItem("addonSelected", value);
                  }}
                />
                <div className="d-block">
                  <p>Reports will be delivered within 3-4 working days. Hard copy charges are non-refundable once the reports have been dispatched.</p>
                  <h3>₹ 100/- <span>Per person</span></h3>
                </div>
              </div>
            </div>
            <div className="bill-summary">


              {/* Bill Summary */}
              <h6 className="">Bill Summary</h6>

              <div className="d-flex justify-content-between mb-1">
                <span>Subtotal</span>
                <span>₹{labTotal.toFixed(2)}</span>
              </div>

              {slotCharge > 0 && (
                <div className="d-flex justify-content-between mb-1">
                  <span>Slot Fixing Charge </span>
                  <span>₹{slotCharge.toFixed(2)}</span>
                </div>
              )}

              {addonSelected && (
                <div className="d-flex justify-content-between mb-1">
                  <span>
                    Value Add-ons (₹{VALUE_ADDON_PRICE} x {patientCount}{" "}
                    {patientCount > 1 ? "persons" : "person"})
                  </span>
                  <span>₹{valueAddOnTotal}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="d-flex justify-content-between mb-1">
                  <span>Discount <span className="cou-value">{appliedCoupon ? `( ${appliedCoupon.code} )` : ""}</span></span>
                  <span className="asasas">-₹{discount.toFixed(2)}</span>
                </div>
              )}

              {/* <div className="d-flex justify-content-between mb-1">
                <span>CGST (9%)</span>
                <span>₹{cgst.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span>SGST (9%)</span>
                <span>₹{sgst.toFixed(2)}</span>
              </div>

              <div className="d-flex justify-content-between mb-1">
                <span>Total GST (18%)</span>
                <span>₹{(cgst + sgst).toFixed(2)}</span>
              </div> */}

              <hr className="cart-hr" />

              <div className="d-flex justify-content-between total-amount-to-pay">
                <h2>Total Payable</h2>

                <h3>
                  {/* ₹{(labTotal - discount + valueAddOnTotal).toFixed(2)} */}
                  ₹{grandTotal.toFixed(2)}
                </h3>
              </div>

              <button className="proceed-to-checkout" onClick={handleContinue}>
                Proceed To Checkout <i className="fa fa-arrow-right ms-1"></i>
              </button>
              <h5><i className="fa fa-lock" aria-hidden="true"></i> Safe and Secure Payment</h5>
            </div>
          </div>
        )}
      </div>


      {/* Select Patients Modal */}
      <Modal
        className="cart-modal-new-css"
        show={showSelectModal}
        onHide={() => setShowSelectModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="mb-0"><img src={patientadds} className="select-patient-labsessd" alt="" /> Select Patients</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : patients.length === 0 ? (
            <p className="text-center text-muted">No patients found.</p>
          ) : (
            <Form>
              {patients.map((p) => {
                const selected = selectedPatients[activeTest]?.some(
                  (sp) => sp._id === p._id
                );
                return (
                  <div
                    key={p._id}
                    className={`select-pateint-div-new d-flex ${selected ? "active-patient d-flex" : ""}`}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      if (e.target.closest(".edit-patient-btn")) return;
                      togglePatientSelection(activeTest, p);
                    }}
                  >
                    <Form.Check
                      type="checkbox"
                      id={`patient-${p._id}`}
                      checked={selected}
                      onChange={() => togglePatientSelection(activeTest, p)}
                      onClick={e => e.stopPropagation()}
                      style={{ marginRight: "12px" }}
                    />
                    <i className="fa fa-user-circle" aria-hidden="true"></i>
                    <div style={{ flex: 1 }}>
                      <p className="pnamese" style={{ marginBottom: 0 }}>
                        {`${p.name}`}
                      </p>
                      <p className="geneder-age" style={{ marginBottom: '5px', marginTop: '5px' }}>
                        {p.age !== undefined && p.age !== null && <> {p.age} years</>}
                        <span className="gender-age2"><span>•</span> {p.gender && <> {p.gender.charAt(0).toUpperCase() + p.gender.slice(1)}</>}</span>
                      </p>
                      <p className="self-names" style={{ marginBottom: 0 }}>{p.relation || "Self"}</p>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPatient(p);
                      }}
                      className="edit-patient-btn"
                    >
                      <i className="fas fa-edit"></i>
                    </div>
                  </div>
                );
              })}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="addpatient-button-labtest"
            onClick={handleOpenAddModal}
          >
            Add New Patient
          </Button>

          <Button className="done-button-labtest" onClick={() => setShowSelectModal(false)}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add/Edit Patient Modal */}
      <Modal className="cart-modal-new-css" show={showAddModal} size="lg" onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <img src={patientadds} className="select-patient-labsessd" alt="" />  {editingPatient ? "Edit Patient" : "Add New Patient"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="patient-selection" encType="multipart/form-data">
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder={editingPatient ? "" : "Enter Name"}
                value={patientForm.name}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                placeholder="Gender"
                value={patientForm.gender}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, gender: e.target.value })
                }
                required
              >
                <option value="" hidden>
                  Select
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Age</Form.Label>
              <Form.Control
                placeholder={editingPatient ? "" : "Enter Age"}
                type="number"
                min="1"
                value={patientForm.age}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, age: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Relation</Form.Label>
              <Form.Select

                value={patientForm.relation}
                onChange={(e) =>
                  setPatientForm({ ...patientForm, relation: e.target.value })
                }
              >
                <option hidden>Select Relation</option>
                <option value="Self" disabled={selfExists}>Self</option>
                <option value="Spouse">Spouse</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Medical History</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder={editingPatient ? "" : "Enter Medical History"}
                value={patientForm.medical_history}
                onChange={(e) =>
                  setPatientForm({
                    ...patientForm,
                    medical_history: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Allergies</Form.Label>
              <Form.Control
                as="textarea"
                placeholder={editingPatient ? "" : "Enter Allergies"}
                rows={2}
                value={patientForm.allergies}
                onChange={(e) =>
                  setPatientForm({
                    ...patientForm,
                    allergies: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prescription (Images/PDFs)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) =>
                  setPatientForm({
                    ...patientForm,
                    prescription: Array.from(e.target.files),
                  })
                }
              />

              {/* Preview Section */}
              <div
                className="preview-container mt-2"
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {patientForm?.prescription?.map((file, index) => {
                  const isString = typeof file === "string";
                  const fileUrl = isString
                    ? file.startsWith("http")
                      ? file
                      : `${API_URL}${file}`
                    : URL.createObjectURL(file);
                  const isPdf =
                    (isString && file.endsWith(".pdf")) ||
                    (!isString && file.type === "application/pdf");

                  return (
                    <div
                      key={index}
                      className="preview-item"
                      style={{
                        position: "relative",
                        width: "100px",
                        minHeight: "100px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        padding: "5px",
                        backgroundColor: "#fff",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      {isPdf ? (
                        <a href={fileUrl} target="_blank" rel="noreferrer">
                          <div style={{ fontSize: "28px", color: "#e74c3c" }}>
                            <i className="bi bi-file-earmark-pdf"></i>
                          </div>
                          <div
                            style={{
                              fontSize: "12px",
                              marginTop: "5px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "90%",
                            }}
                          >
                            Click to preview
                          </div>
                        </a>
                      ) : (
                        <a href={fileUrl} target="_blank" rel="noreferrer">
                          <img
                            src={fileUrl}
                            alt="preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        </a>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFiles = [...newPatient.prescription];
                          updatedFiles.splice(index, 1);
                          setPatientForm({ ...patientForm, prescription: updatedFiles });
                        }}
                        style={{
                          position: "absolute",
                          top: 2,
                          right: 2,
                          padding: "2px 6px",
                          fontSize: "12px",
                          borderRadius: "50%",
                          border: "none",
                          background: "#e74c3c",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="pateinty-add-update"
            onClick={handleSavePatient}
          >
            {addingPatient ? "Saving..." : editingPatient ? "Update Patient" : "Add New Patient"}
          </Button>
          <Button className="done-button-labtest" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* === Coupon Modal === */}
      <Modal show={showCoupons} onHide={() => setShowCoupons(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">Apply Coupon</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Manual Coupon Input */}
          <Form className="d-flex mb-3">
            <Form.Control
              type="text"
              placeholder="Enter coupon code"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
            />
            <Button
              variant="primary"
              className="ms-2"
              onClick={() => {
                if (!manualCode.trim()) return toast.error("Enter coupon code");
                applyCoupon(manualCode.trim());
                setManualCode("");
              }}
            >
              Apply
            </Button>
          </Form>

          {/* Applied Coupon Banner */}
          {appliedCoupon && (
            <div className="bg-success bg-opacity-10 border border-success rounded-3 p-3 mb-3 d-flex justify-content-between align-items-center">
              <div className="text-success fw-semibold">
                ✅ <strong>{appliedCoupon.code}</strong> Applied –{" "}
                {appliedCoupon.discountType === "percentage"
                  ? `${appliedCoupon.discountValue}%`
                  : `₹${appliedCoupon.discountValue}`}{" "}
                OFF
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={removeCoupon}
              >
                Remove
              </Button>
            </div>
          )}

          {/* Available Coupons List */}
          <div className="fw-semibold mb-2">Available Coupons</div>
          {availableCoupons.length ? (
            availableCoupons.map((c) => {
              const isApplied = appliedCoupon?.code === c.code;
              return (
                <div
                  key={c._id}
                  className={`border rounded-3 p-2 mb-2 d-flex justify-content-between align-items-center ${isApplied ? "bg-success bg-opacity-10 border-success" : "bg-light"}`}
                >
                  <div>
                    <div className="fw-semibold">{c.code}</div>
                    <small className="text-muted">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}%`
                        : `₹${c.discountValue}`}{" "}
                      OFF on your booking
                    </small>
                  </div>

                  {isApplied ? (
                    <Button variant="success" size="sm" disabled>
                      Applied
                    </Button>
                  ) : (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => applyCoupon(c.code)}
                    >
                      Apply
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-muted small">No coupons available</div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCoupons(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



      <LoginModal isOpen={loginOpen} onClose={() => { setLoginOpen(false), window.location.reload() }} />

    </div>
  );
};

export default Cart;
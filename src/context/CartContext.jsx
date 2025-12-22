// src/context/CartContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {

  // const [labCart, setLabCart] = useState([]);
  // const [doctorCart, setDoctorCart] = useState([]);
  // const [selectedAddress, setSelectedAddress] = useState(null);
  // const [selectedPatient, setSelectedPatient] = useState(null);


  // Load from localStorage if available
  const [labCart, setLabCart] = useState(() => {
    const saved = localStorage.getItem("labCart");
    return saved ? JSON.parse(saved) : [];
  });

  const [doctorCart, setDoctorCart] = useState(() => {
    const saved = localStorage.getItem("doctorCart");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState(() => {
    const saved = localStorage.getItem("selectedCategory");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedDoctor, setSelectedDoctor] = useState(() => {
    const saved = localStorage.getItem("selectedDoctor");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedDoctorName, setSelectedDoctorName] = useState(() => {
    const saved = localStorage.getItem("selectedDoctorName");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedAddress, setSelectedAddress] = useState(() => {
    const saved = localStorage.getItem("selectedAddress");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedPatient, setSelectedPatient] = useState(() => {
    const saved = localStorage.getItem("selectedPatient");
    return saved ? JSON.parse(saved) : null;
  });


  const [selectedSlot, setSelectedSlot] = useState(() => {
    const saved = localStorage.getItem("selectedSlot");
    return saved ? JSON.parse(saved) : null;
  });

  // ✅ Separate slots for different booking types
  const [selectedLabSlot, setSelectedLabSlot] = useState(() => {
    const saved = localStorage.getItem("selectedLabSlot");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedLobbySlot, setSelectedLobbySlot] = useState(() => {
    const saved = localStorage.getItem("selectedLobbySlot");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedSpecialistSlot, setSelectedSpecialistSlot] = useState(() => {
    const saved = localStorage.getItem("selectedSpecialistSlot");
    return saved ? JSON.parse(saved) : null;
  });

  // const [preferredLanguage, setPreferredLanguage] = useState(() => {
  //   const saved = localStorage.getItem("preferredLanguage");
  //   return saved ? JSON.parse(saved) : ["English"];
  // });

  const [preferredLanguage, setPreferredLanguage] = useState(() => {
    const saved = localStorage.getItem("preferredLanguage");
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch { }
    // if saved is a string, return [string], else []
    if (saved && typeof saved === "string") return [saved];
    return [];
  });

  const [consultationType, setConsultationType] = useState(() => {
    const saved = localStorage.getItem("consultationType");
    return saved ? JSON.parse(saved) : "Audio";
  });

  const [totalAmount, setTotalAmount] = useState(() => {
    const saved = localStorage.getItem("totalAmount");
    return saved ? Number(saved) : 0;
  });

  // ✅ NEW: Applied Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const saved = localStorage.getItem("appliedCoupon");
    return saved ? JSON.parse(saved) : null;
  });

  // ✅ NEW: Discount Amount State
  const [discount, setDiscount] = useState(() => {
    const saved = localStorage.getItem("discount");
    return saved ? Number(saved) : 0;
  });

  const [prescriptions, setPrescriptions] = useState([]); // stores the uploaded file

  const [addonSelected, setAddonSelected] = useState(false);


  // Persist to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem("labCart", JSON.stringify(labCart));
  }, [labCart]);

  useEffect(() => {
    localStorage.setItem("doctorCart", JSON.stringify(doctorCart));
  }, [doctorCart]);

  useEffect(() => {
    localStorage.setItem("selectedCategory", JSON.stringify(selectedCategory));
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
  }, [selectedAddress]);

  useEffect(() => {
    localStorage.setItem("selectedPatient", JSON.stringify(selectedPatient));
  }, [selectedPatient]);

  useEffect(() => {
    localStorage.setItem("selectedSlot", JSON.stringify(selectedSlot));
  }, [selectedSlot]);

  useEffect(() => {
    localStorage.setItem("selectedLabSlot", JSON.stringify(selectedLabSlot));
  }, [selectedLabSlot]);

  useEffect(() => {
    localStorage.setItem("selectedLobbySlot", JSON.stringify(selectedLobbySlot));
  }, [selectedLobbySlot]);

  useEffect(() => {
    localStorage.setItem("selectedSpecialistSlot", JSON.stringify(selectedSpecialistSlot));
  }, [selectedSpecialistSlot]);


  useEffect(() => {
    localStorage.setItem("preferredLanguage", JSON.stringify(preferredLanguage));
  }, [preferredLanguage]);

  useEffect(() => {
    localStorage.setItem("consultationType", JSON.stringify(consultationType));
  }, [consultationType]);

  useEffect(() => {
    localStorage.setItem("totalAmount", totalAmount);
  }, [totalAmount]);

  useEffect(() => {
    localStorage.setItem("addonSelected", addonSelected);
  }, [addonSelected]);



  // ✅ NEW: Persist applied coupon
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("appliedCoupon");
    }
  }, [appliedCoupon]);

  // ✅ NEW: Persist discount
  useEffect(() => {
    localStorage.setItem("discount", discount);
  }, [discount]);


  // ✅ Booking payload for Lobby Doctor
  const getLobbyDoctorBookingPayload = () => ({
    category: selectedCategory,
    patient: selectedPatient,
    slot: selectedSlot,
    // address: selectedAddress,
    doctors: ["lobby-doctor"],
    labTests: [],
    // totalAmount: totalAmount || 500, // replace with dynamic calculation if needed
    totalAmount: totalAmount, // replace with dynamic calculation if needed

    type: "lobby",
    email: selectedPatient?.email || "user@example.com",
    userId: selectedPatient?._id,
    preferredLanguage,
    consultationType,
  });


  // ✅ Specialist Doctor Payload
  const getSpecialistDoctorBookingPayload = () => ({
    category: selectedCategory,
    patient: selectedPatient,
    doctors: selectedDoctor,
    slot: selectedSlot,
    address: selectedAddress,
    // doctors: doctorCart.map(d => d._id), // all selected specialist doctors
    labTests: labCart.map(l => l._id), // optional if linked to tests
    totalAmount: totalAmount || 0, // adjust default for specialist
    type: "specialist",
    email: selectedPatient?.email || "user@example.com",
    userId: selectedPatient?._id,
    preferredLanguage,
    consultationType,
    // optional extra fields
    // symptoms: doctorCart.map(d => d.symptoms).filter(Boolean),
    // notes: doctorCart.map(d => d.notes).filter(Boolean),
  });


  // ✅ Add to Lab Cart
  const addToLabCart = (item, type) => {
    const newItem = { ...item, itemType: type }; // <-- ADD FLAG HERE
  
    setLabCart((prev) => {
      const exists = prev.find((p) => p._id === newItem._id);
      if (exists) return prev;
      return [...prev, newItem];
    });
  };


  // ✅ Remove from Lab Cart
  const removeFromLabCart = (id) => {
    // 1. Remove test from cart
    setLabCart((prev) => prev.filter((item) => item._id !== id));

    // 2. Remove patients assigned to this test

      const stored = JSON.parse(localStorage.getItem("selectedPatientsPerTest") || "{}");

      if (stored[id]) {
        delete stored[id];
        localStorage.setItem(
          "selectedPatientsPerTest",
          JSON.stringify(stored)
        );
      }

  };

  // ✅ Add to Doctor Cart
  const addToDoctorCart = (item) => {
    setDoctorCart((prev) => {
      const exists = prev.find((p) => p._id === item._id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  // ✅ Remove from Doctor Cart
  const removeFromDoctorCart = (id) => {
    setDoctorCart((prev) => prev.filter((item) => item._id !== id));
  };


  // ✅ Clear functions (for payment success, logout, etc.)
  const clearLabCart = () => {
    setLabCart([]);
    localStorage.removeItem("labCart");
    localStorage.removeItem("selectedPatientsPerTest");
    localStorage.removeItem("selectedAddress");
    localStorage.removeItem("selectedPatient");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("selectedSlot");
  };

  const clearDoctorCart = () => {
    setDoctorCart([]);
    localStorage.removeItem("doctorCart");
  };

  const clearAllCarts = () => {
    clearLabCart();
    clearDoctorCart();
    setSelectedAddress(null);
    setSelectedPatient(null);
    setSelectedCategory(null);
    setSelectedSlot(null);
    localStorage.removeItem("selectedAddress");
    localStorage.removeItem("selectedPatient");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("selectedSlot");
  };

  /* -----------------------
      4. RESET FOR NEW BOOKINGS
  ------------------------- */

  const resetBookingState = () => {
    setSelectedSlot(null);
    setSelectedPatient(null);
    setSelectedAddress(null);
    setSelectedDoctor(null);
    setConsultationType(null);
  };


  const uploadPrescription = (files) => {
    setPrescriptions(prev => [...prev, ...files]); // append new files
  };
  
  const clearPrescription = () => setPrescriptions([]);



  return (
    <CartContext.Provider
      value={{
        labCart, addToLabCart, removeFromLabCart,
        doctorCart, addToDoctorCart, removeFromDoctorCart,
        selectedCategory, setSelectedCategory,
        selectedDoctor, setSelectedDoctor,
        selectedDoctorName, setSelectedDoctorName,
        selectedAddress, setSelectedAddress,
        selectedPatient, setSelectedPatient,
        selectedSlot, setSelectedSlot,
        selectedLabSlot, setSelectedLabSlot,
        selectedLobbySlot, setSelectedLobbySlot,
        selectedSpecialistSlot, setSelectedSpecialistSlot,
        preferredLanguage, setPreferredLanguage,
        consultationType, setConsultationType,
        totalAmount, setTotalAmount,
        appliedCoupon, setAppliedCoupon,
        discount, setDiscount,
        getLobbyDoctorBookingPayload,
        getSpecialistDoctorBookingPayload,
        clearLabCart, clearDoctorCart, clearAllCarts, resetBookingState,
        prescriptions, setPrescriptions, uploadPrescription, clearPrescription,
        addonSelected, setAddonSelected

      }}
    >
      {children}
    </CartContext.Provider>
  );
};

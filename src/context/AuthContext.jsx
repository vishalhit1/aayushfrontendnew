// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios.js"; // Axios instance
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user and token from localStorage on mount
  useEffect(() => {
    // ❌ If logout just happened, DO NOT restore from localStorage
    if (localStorage.getItem("justLoggedOut") === "true") return;

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  /* Remove the logout flag after first render */
  useEffect(() => {
    if (localStorage.getItem("justLoggedOut")) {
      localStorage.removeItem("justLoggedOut");
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await API.post("/api/users/login", { email, password });
      const { user, token } = res.data;

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // toast.success("Logged in successfully!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const signup = async ({ name, email, password, role = "user", otp, dob, gender }) => {
    try {
      console.log(name, email, password, role, otp, dob, gender);
  
      const res = await API.post("/api/users/register", {
        name,
        email,
        password,
        role,
        otp,
        dob,
        gender,
      });
  
      const { user, token } = res.data;
  
      // Save user & token only if registration is successful
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
      // toast.success("Signed up successfully!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
      return false;
    }
  };
  

  const sendOtp = async ({email,phone}) => {
    try {
      console.log("email",email)
      console.log("phone",phone)

      await API.post("/api/users/send-otp", { email: email, phone: phone });
      toast.success("OTP sent successfully!");
      // setOtpSent(true);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
      return false;
    }
  };

  // ✅ Google login handler
  // Google login
  // const googleLogin = async (credentialResponse) => {
  //   try {
  //     const { credential } = credentialResponse;
  
  //     const res = await API.post("/api/users/google-login", { token: credential });
  //     const data = res.data;
  
  //     if (!data.success) {
  //       toast.error(data.message || "Google login failed");
  //       return null;
  //     }
  
  //     // Save token & user
  //     localStorage.setItem("token", data.token);
  //     localStorage.setItem("user", JSON.stringify(data.user));
  //     setUser(data.user);
  //     API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  
  //     // ✅ Only show success toast if profile is complete
  //     if (data.isComplete) {
  //       toast.success("Logged in successfully!");
  //     }
  
  //     return data; // Return full data for front-end modal check
  //   } catch (err) {
  //     console.error("Google login error:", err);
  //     toast.error("Google login failed");
  //     return null;
  //   }
  // };
  
  const googleLogin = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
  
      const res = await API.post("/api/users/google-login", { token: credential });
      const data = res.data;
  
      if (!data.success) {
        toast.error(data.message || "Google login failed");
        return null;
      }
  
      if (data.isComplete) {
        // ✅ Save in localStorage only if profile is complete
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        // toast.success("Logged in successfully!");
      } else {
        // ⚠️ Temporarily keep token in memory only
        API.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setUser(data.user); // incomplete user
      }
  
      return data;
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed");
      return null;
    }
  };
  
  
  
  const completeProfile = async (data) => {
    try {
      const res = await API.put("/api/users/complete-profile", data);
      setUser(res.data.user);
  
      // ✅ Now store in localStorage because profile is complete
      const token = API.defaults.headers.common["Authorization"].split(" ")[1];
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
  
      toast.success("Profile completed successfully!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
      return false;
    }
  };
  

  const logout = () => {
    setUser(null);
     // Mark that logout just happened
     localStorage.setItem("justLoggedOut", "true");
     
    // Clear stored values
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("labCart");
    localStorage.removeItem("selectedCategory");
    localStorage.removeItem("selectedAddress");
    localStorage.removeItem("selectedPatient");
    localStorage.removeItem("selectedLabSlot");
    localStorage.removeItem("selectedLobbySlot");
    localStorage.removeItem("selectedSlot");
    localStorage.removeItem("preferredLanguage");
    localStorage.removeItem("consultationType");
    localStorage.removeItem("totalAmount");

    delete API.defaults.headers.common["Authorization"];
    // toast.info("Logged out");
    // Soft redirect (NO forced reload)
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, setUser, sendOtp, login, signup, googleLogin, completeProfile,  logout }}>
      {children}
    </AuthContext.Provider>
  );
};

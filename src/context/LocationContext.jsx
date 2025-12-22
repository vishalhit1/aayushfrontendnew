import React, { createContext, useState, useEffect } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [city, setCity] = useState("Mumbai");
  const [pincode, setPincode] = useState("");

  // Optional: detect location automatically on load
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await res.json();

          const detectedCity =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.village ||
            data?.address?.state ||
            "Mumbai";

          const detectedPincode = data?.address?.postcode || "";

          setCity(detectedCity);
          setPincode(detectedPincode);
        } catch (err) {
          console.error("Reverse geocode error:", err);
        }
      },
      (err) => console.error("Location permission denied:", err)
    );
  }, []);

  return (
    <LocationContext.Provider value={{ city, setCity, pincode, setPincode }}>
      {children}
    </LocationContext.Provider>
  );
};

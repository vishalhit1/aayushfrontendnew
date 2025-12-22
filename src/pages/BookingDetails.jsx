import React from "react";
import { useParams } from "react-router-dom";
import DoctorBookingDetails from "./DoctorBookingDetails";
import LabBookingDetails from "./LabBookingDetails";

const BookingDetails = () => {
  const { type } = useParams();

  if (type === "doctor") return <DoctorBookingDetails />;
  if (type === "lab") return <LabBookingDetails />;

  return <p>Invalid booking type!</p>;
};

export default BookingDetails;

// /components/FeedbackForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const FeedbackModal = ({ bookingId, userId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitFeedback = async () => {
    try {
      await axios.post(`${API_URL}/api/feedback/submit`, {
        bookingId,
        rating,
        comment,
        givenBy: userId,
        givenByModel: "User",
      });
      toast.success("Feedback submitted successfully!");
    } catch {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="feedback-container">
      <h5>Rate your Consultation</h5>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1,2,3,4,5].map((r) => (
          <option key={r} value={r}>{r} ★</option>
        ))}
      </select>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write feedback..."
      />
      <button onClick={submitFeedback}>Submit</button>
    </div>
  );
};

export default FeedbackModal;

import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const DoctorFeedback = ({ bookingId, doctorId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("bookingId", bookingId);
      formData.append("rating", rating);
      formData.append("comment", comment);
      formData.append("givenBy", doctorId);
      formData.append("givenByModel", "Doctor");
      files.forEach((file) => formData.append("prescriptions", file));

      await axios.post(`${API_URL}/api/feedback/submit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Feedback & prescription submitted!");
    } catch {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <div className="feedback-container">
      <h5>Submit Feedback / Prescription</h5>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[1,2,3,4,5].map((r) => (
          <option key={r} value={r}>{r} ★</option>
        ))}
      </select>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add notes..."
      />
      <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files))} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default DoctorFeedback;

import React, { useEffect, useState } from "react";
import { doctorAPI } from "../../api/axios";
import { Form, Button, Table, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { API_URL } from "../../../config";
import { Multiselect } from "multiselect-react-dropdown";
import "../../styles/doctorprofile.css";

const DoctorProfile = ({ doctorId }) => {
  const [editDoctor, setEditDoctor] = useState({});
  const [reviews, setReviews] = useState([]);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [languagesList, setLanguagesList] = useState([]);
  useEffect(() => {
    fetchCategories();
    fetchLanguages();
  }, []);
  useEffect(() => {
    if (doctorId && languagesList.length > 0) {
      fetchProfile();
      fetchReviews();
    }
  }, [doctorId, languagesList]);
  const fetchLanguages = async () => {
    try {
      const res = await doctorAPI.get("/api/commonmaster/getActivelanguages");
      const options = res.data.languages.map((lang) => ({
        name: lang.name,
        id: lang._id,
      }));
      setLanguagesList(options);
    } catch {
      console.log("Failed to fetch languages")
      // toast.error("Failed to fetch languages");
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await doctorAPI.get(`/api/category/getActiveCategories`);
      setCategories(res.data.categories);
    } catch (err) {
      console.log("Error fetching categories")
      // toast.error("Error fetching categories");
    }
  };
  const fetchProfile = async () => {
    try {
      const res = await doctorAPI.get(`/api/doctors/${doctorId}`);
      const doctor = res.data.doctor;
      // :jigsaw: Normalize languages for Multiselect
      const formattedLanguages = (doctor.languages || []).map((lang) => {
        if (typeof lang === "object" && lang.name) return lang;
        const match = languagesList.find(
          (l) => l.name.toLowerCase() === lang.toLowerCase()
        );
        return match || { name: lang, id: lang };
      });
      const specializationid = doctor.specialization._id
      setEditDoctor({ ...doctor, languages: formattedLanguages, specialization: specializationid });
      if (doctor.profileImage?.length > 0) {
        setPreview(
          `${API_URL}/uploads/doctors/${doctor.profileImage[0]?.filename}`
        );
      } else {
        setPreview("");
      }
    } catch {
      console.log("Failed to fetch profile")
      // toast.error("Failed to fetch profile");
    }
  };
  console.log("editDoctor", editDoctor)
  const fetchReviews = async () => {
    try {
      const res = await doctorAPI.get(`/api/doctorsreview/${doctorId}/reviews`);
      setReviews(res.data.reviews);
    } catch (err) {
      console.log(err)
      // toast.error("Failed to fetch reviews");
    }
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("specialization", editDoctor.specialization)
    try {
      const formData = new FormData();
      const { profileImage, languages, ...rest } = editDoctor;
      Object.keys(rest).forEach((key) => formData.append(key, rest[key]));
      if (languages && Array.isArray(languages)) {
        const langNames = languages.map((l) => l.name || l);
        formData.append("languages", JSON.stringify(langNames));
      }
      if (profileImage instanceof File) {
        formData.append("profileImage", profileImage);
      }
      console.log(Array.from(formData))
      await doctorAPI.put(`/api/doctors/${doctorId}/doctorprofile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile updated successfully");
      fetchProfile();
      // :white_check_mark: Update localStorage doctor info
      const storedDoctor = JSON.parse(localStorage.getItem("doctorInfo"));
      if (storedDoctor) {
        const updatedDoctor = {
          ...storedDoctor,
          name: editDoctor.name, // update only the name
          profileImage: editDoctor.profileImage

        };
        localStorage.setItem("doctorInfo", JSON.stringify(updatedDoctor));
      }

      // :white_check_mark: Refresh the page after short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch {
      toast.error("Failed to update profile");
    }
  };
  const toggleAvailability = async () => {
    try {
      const newStatus = !editDoctor.status;
      await doctorAPI.put(`/api/doctors/${doctorId}/availability`, {
        isOnline: newStatus,
      });
      setEditDoctor({ ...editDoctor, status: newStatus });
      toast.success(`Status set to ${newStatus ? "Online" : "Offline"}`);
    } catch {
      toast.error("Failed to update availability");
    }
  };

  return (
    <div>
      <div className="profilecobntent">
        <h3>Doctor Profile</h3>
      </div>
      <div className="form-data-abcd">

        <Form onSubmit={handleEditSubmit}>
          <div
            className="mb-3"
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            <label className="switch">
              <input
                type="checkbox"
                checked={editDoctor.status || false}
                onChange={toggleAvailability}
              />
              <span className="slider"></span>
            </label>
            <span className={editDoctor.status ? "online" : "offline"}>
              {editDoctor.status ? "Online" : "Offline"}
            </span>
          </div>

          {/* Profile Image Upload & Preview */}
          <Form.Group className="mb-4 text-center">
            {preview && (
              <Image
                src={preview}
                roundedCircle
                width={150}
                height={150}
                style={{
                  objectFit: "cover",
                  border: "3px solid #0d6efd",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
                className="mb-3"
              />
            )}
            <Form.Control
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setEditDoctor({ ...editDoctor, profileImage: file });
                setPreview(URL.createObjectURL(file));
              }}
              style={{ maxWidth: "300px", margin: "0 auto" }}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={editDoctor.name || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, name: e.target.value })
              }
              placeholder="Enter your full name"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <label>Specialization</label>
            <Form.Control
              as="select"
              value={editDoctor.specialization || ""}
              onChange={(e) => {
                const selected = categories.find(
                  (cat) => cat._id === e.target.value
                );
                setEditDoctor({ ...editDoctor, specialization: selected });
              }}
            >
              <option value="" hidden>
                Select Specialization
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-2">
            <label>Experience (in years)</label>
            <Form.Control
              type="number"
              value={editDoctor.experience || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, experience: e.target.value })
              }
              placeholder="Enter experience in years"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <label>Consultation Fee</label>
            <Form.Control
              type="number"
              value={editDoctor.fees || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, fees: e.target.value })
              }
            />
          </Form.Group>

          {/* ✅ Multiselect for Languages */}
          <Form.Group className="mb-2">
            <label>Languages</label>
            <Multiselect
              options={languagesList}
              selectedValues={editDoctor.languages || []}
              onSelect={(selectedList) =>
                setEditDoctor({ ...editDoctor, languages: selectedList })
              }
              onRemove={(selectedList) =>
                setEditDoctor({ ...editDoctor, languages: selectedList })
              }
              displayValue="name"
              placeholder="Select Languages"
              showCheckbox
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <label>Bio</label>
            <Form.Control
              as="textarea"
              rows={5}
              style={{ height: 'auto' }}
              value={editDoctor.bio || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, bio: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <label>Qualifications</label>
            <Form.Control
              as="textarea"
              rows={5}
              style={{ height: 'auto' }}
              value={editDoctor.qualifications || ""}
              onChange={(e) =>
                setEditDoctor({ ...editDoctor, qualifications: e.target.value })
              }
            />
          </Form.Group>

          <button type="submit" className="update-prifle-buttons">
            Update Profile
          </button>
        </Form>
      </div>
      <div className="profilecobntent">
        <h3>Ratings & Reviews</h3>
      </div>
      <div className="form-data-abcd">
        <Table bordered hover>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Rating</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id}>
                <td>{r.patientName}</td>
                <td>{r.rating}</td>
                <td>{r.comment}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorProfile;
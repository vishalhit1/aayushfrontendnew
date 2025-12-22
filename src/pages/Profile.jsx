
import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import API from "../api/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import "../styles/profile.css";
import { API_URL } from "../../config.js";
import ConsultationTab from "./ConsultationTab.jsx";
import MembersTab from "./MembersTab.jsx";
import { Link } from "react-router-dom";
import LabReportsTab from "./LabReportsTab.jsx";
const Profile = () => {
  // const { user, setUser } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [consultations, setConsultations] = useState([]);
  const [labOrders, setLabOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: new Date(),
    gender: "",
  });
  // Members state
  const [members, setMembers] = useState([])
  const [member, setMember] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    relation: "Self",
    medical_history: "",
    allergies: "",
    prescription: []
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  // Initialize form data when user changes
  // useEffect(() => {
  //   if (user) {
  //     setFormData({
  //       name: user.name || "",
  //       email: user.email || "",
  //       phone: user.phone || "",
  //       dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
  //       gender: user.gender || "",
  //     });
  //   }
  // }, [user]);
  const fetchUserProfile = async () => {
    try {
      const res = await API.get("/api/users/profile");
      if (res.data.success) {
        setUser(res.data.user);
        setFormData({
          name: res.data.user.name || "",
          email: res.data.user.email || "",
          phone: res.data.user.phone || "",
          dob: res.data.user.dob ? new Date(res.data.user.dob).toISOString().split("T")[0] : "",
          gender: res.data.user.gender || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      toast.error("Failed to load profile details");
    }
  };
  console.log("formdata", formData)
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const res = await API.put("/api/users/profile", formData);
      toast.success("Profile updated!");
      setEditMode(false);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  // Fetch consultations, lab orders, members
  // Fetch user consultations
  const fetchConsultations = async () => {
    try {
      const res = await API.get("/api/booking/all");
      setConsultations(res.data.doctorBookings || []);
    } catch (err) {
      console.error(err);
      // toast.error("Failed to fetch consultations");
    }
  };
  // Fetch lab orders
  const fetchLabOrders = async () => {
    try {
      const res = await API.get("/api/booking/lab-tests");
      setLabOrders(res.data.bookings || []);
    } catch (err) {
      console.error(err);
      // toast.error("Failed to fetch lab orders");
    }
  };
  // Fetch members/patients
  const fetchMembers = async () => {
    try {
      const res = await API.get("/api/users/patients");
      setMembers(res.data.patients || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch members");
    }
  };
  // Call them separately in useEffect
  // useEffect(() => {
  //   fetchUserProfile();
  //   fetchConsultations();
  //   fetchLabOrders();
  //   fetchMembers();
  // }, []);
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchUserProfile(),
          fetchConsultations(),
          fetchLabOrders(),
          fetchMembers(),
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);
  console.log("members", members)
  // --- Member handlers ---
  const handlememberChange = (e) =>
    setMember({ ...member, [e.target.name]: e.target.value });
  // Handle file add
  const handlememberFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMember((prev) => ({
      ...prev,
      prescription: [...prev.prescription, ...files],
    }));
  };
  // Remove a file by index
  const removeFile = (index) => {
    setMember((prev) => ({
      ...prev,
      prescription: prev.prescription.filter((_, i) => i !== index),
    }));
  };
  // const handleMembersubmit = async (e) => {
  //   e.preventDefault();
  //   if (!member.name || !member.age || !member.gender || !member.phone) {
  //     return toast.error("All fields are required!");
  //   }
  //   try {
  //     setLoading(true);
  //     const formData = new FormData();
  //     for (let key in form) {
  //       if (key !== "prescription") formData.append(key, form[key]);
  //     }
  //     member.prescription.forEach((file) => {
  //       if (file instanceof File) formData.append("prescription", file);
  //     });
  //     if (editingId) {
  //       await API.patch(`/api/users/patient/${editingId}`, formData);
  //       toast.success("Member updated!");
  //     } else {
  //       await API.post("/api/users/patient", formData);
  //       toast.success("Member added!");
  //     }
  //     setMember({
  //       name: "",
  //       age: "",
  //       gender: "",
  //       phone: "",
  //       relation: "Self",
  //       medical_history: "",
  //       allergies: "",
  //       prescription: []
  //     });
  //     setEditingId(null);
  //     setShowModal(false);
  //     fetchData();
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Failed to save member");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleMembersubmit = async (e) => {
    e.preventDefault();
    if (!member.name || !member.age || !member.gender || !member.phone) {
      return toast.error("All fields are required!");
    }
    try {
      setLoading(true);
      const formData = new FormData();
      for (let key in member) {
        if (key !== "prescription") formData.append(key, member[key]);
      }
      member.prescription.forEach((file) => {
        if (file instanceof File) formData.append("prescription", file);
      });

      if (editingId) {
        await API.patch(`/api/users/patient/${editingId}`, formData);
        toast.success("Member updated!");
      } else {
        await API.post("/api/users/patient", formData);
        toast.success("Member added!");
      }

      setMember({
        name: "",
        age: "",
        gender: "",
        phone: "",
        relation: "Self",
        medical_history: "",
        allergies: "",
        prescription: []
      });
      setEditingId(null);
      setShowModal(false);
      fetchMembers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save member");
    } finally {
      setLoading(false);
    }
  };



  const handleEditMember = async (member) => {
    setMember({
      name: member.name,
      age: member.age,
      gender: member.gender,
      phone: member.phone,
      relation: member.relation || "Self",
      medical_history: member.medical_history || "",
      allergies: member.allergies || "",
      prescription: member.prescription || [],
    });
    setEditingId(member._id);
    setShowModal(true);
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await API.delete(`/api/users/patient/${id}`);
      toast.success("Member deleted!");
      setMembers(members.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete member");
    }
  };
  // const handleAddMemberModal = () => {
  //   setMember({
  //     name: user?.name || "",
  //     age: user?.dob ? new Date().getFullYear() - new Date(user?.dob).getFullYear() : "",
  //     gender: user?.gender ? user?.gender.charAt(0).toUpperCase() + user?.gender.slice(1) : "",
  //     phone: user?.phone || "",
  //     relation: "Self",
  //     medical_history: "",
  //     allergies: "",
  //     prescription: []
  //   });
  //   setEditingId(null);
  //   setShowModal(true);
  // };
  const handleAddMemberModal = () => {
    setMember({
      name: "",
      age: "",
      gender:  "",
      phone:  "",
      relation: "Self",
      medical_history: "",
      allergies: "",
      prescription: []
    });
    setEditingId(null);
    setShowModal(true);
  };
  const allowOnlyNumbers = (value) => {
    return value?.replace(/\D/g, "") || "";
  };
  if (loading) {
    return (
      <div className="fullpage-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  console.log("labOrders>>>>>>>>>>>>>>>>>>>>>>>>", labOrders)

  return (
    <>
      <div className="breadcrumb-bar mb-5">
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
                    User Profile
                  </li>
                  <li className="breadcrumb-item active">{user?.name || "John Doe"}</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-3">
            <div className="card p-3">
              {/* Profile Picture */}
              <img
                src="https://doccure.dreamstechnologies.com/html/template/assets/img/patients/patient23.jpg" // dummy profile image
                alt="User Avatar"
                className="rounded-circle mb-2 profile-imagess"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              {/* User Info */}
              <div className="user-infos">
                <h5 className="">{user?.name || "John Doe"}</h5>
                <p>{user?.email || "johndoe@example.com"}</p>
              </div>

              {/* Sidebar Navigation */}
              {["profile", "members", "consultations", "lab-reports"].map(tab => (
                <div
                  key={tab}
                  className={`active-sase ${activeTab === tab ? "active-abds" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            {activeTab === "profile" && (
              <section>
                <div className="profilecobntent">
                  <h3>Personal Information</h3>
                </div>
                <div className="card p-3 form-contsolases">
                  <Row>
                    {editMode ? (
                      <>
                        <div className="mb-2 col-lg-6">
                          <label>Name:</label>
                          <input type="text" name="name" placeholder="Enter your name" value={formData?.name} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="mb-2 col-lg-6">
                          <label>Email:</label>
                          <input type="email" name="email" placeholder="Enter your email" value={formData?.email} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="mb-2 col-lg-6">
                          <label>Phone:</label>
                          <input type="text" name="phone" placeholder="Enter your phone number" value={formData?.phone} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="mb-2 col-lg-6">
                          <label>Date of Birth:</label>
                          <input type="date" name="dob" placeholder="Enter your date of birth" value={formData?.dob} onChange={handleChange} className="form-control" />
                        </div>
                        <div className="mb-3 col-lg-6">
                          <label>Gender:</label>
                          <select name="gender" placeholder="Select your gender" value={formData?.gender} onChange={handleChange} className="form-select">
                            <option value="" hidden>Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <Row>
                          <div className="mb-2 col-lg-6">
                            <label>Name:</label>
                            <input type="text" className="form-control" value={user.name} disabled />
                          </div>
                          <div className="mb-2 col-lg-6">
                            <label>Email:</label>
                            <input type="email" className="form-control" value={user.email} disabled />
                          </div>
                          <div className="mb-2 col-lg-6">
                            <label>Phone:</label>
                            <input type="text" className="form-control" value={user.phone || "-"} disabled />
                          </div>
                          <div className="mb-2 col-lg-6">
                            <label>Date of Birth:</label>
                            <input type="text" className="form-control" value={user.dob ? new Date(user.dob).toLocaleDateString() : "-"} disabled />
                          </div>
                          <div className="mb-3 col-lg-6">
                            <label>Gender:</label>
                            <input type="text" className="form-control" value={user.gender || "-"} disabled />
                          </div>
                        </Row>
                      </>
                    )}
                  </Row>

                  <div>
                    {editMode ? (
                      <>
                        <button className="btn btn-success me-2" onClick={handleSaveProfile} disabled={loading}>Update Profile</button>
                        <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>
                    )}
                  </div>
                </div>
              </section>
            )}

            {activeTab === "consultations" && (
              <section>
                <div className="profilecobntent">
                  <h3>Consultations</h3>
                </div>
                {consultations.length === 0 ? <div className="nobookingneeded">No consultations booked yet.</div> :
                  <ConsultationTab consultations={consultations} />}
              </section>
            )}

            {activeTab === "lab-reports" && (
              <section>
                <div className="profilecobntent">
                  <h3>Labs Reports</h3>
                </div>
                <LabReportsTab labOrders={labOrders} />
              </section>
            )}

            {activeTab === "members" && (
              <MembersTab
                members={members}
                member={member}
                editingId={editingId}
                showModal={showModal}
                setShowModal={setShowModal}
                handleAddMemberModal={handleAddMemberModal}
                handleEditMember={handleEditMember}
                handleDelete={handleDelete}
                handlememberChange={handlememberChange}
                handlememberFileChange={handlememberFileChange}
                removeFile={removeFile}
                handleMembersubmit={handleMembersubmit}
              />
            )}

            {/* {activeTab === "prescriptions" && (
              <section>
                <div className="profilecobntent">
                  <h3>Prescriptions</h3>
                </div>

                {consultations.length === 0 ? (
                  <div className="nobookingneeded">No prescriptions available.</div>
                ) : (
                  consultations.map((booking) => (
                    booking.prescription?.length > 0 && (
                      <Card key={booking._id} className="mb-2 p-2">
                        <p><strong>Doctor:</strong> {booking.doctor?.name || "N/A"}</p>
                        <p><strong>Date:</strong> {new Date(booking.slot?.date).toLocaleDateString()}</p>
                        <p><strong>Time:</strong> {booking.slot?.startTime || "-"}</p>

                        {booking.prescription.map((p, i) => (
                          <Card key={i} className="mb-2 p-2">
                            <strong>{p.title}</strong>
                            {p.notes && <p>{p.notes}</p>}

                            {p.file && (
                              <div className="d-flex flex-wrap gap-3 mt-2">
                                {Array.isArray(p.file) ? (
                                  p.file.map((fileUrl, idx) => (
                                    <div key={idx} style={{ flex: "0 0 45%" }}>
                                      {fileUrl.endsWith(".pdf") ? (
                                        <iframe
                                          src={`${API_URL}${fileUrl}`}
                                          width="100%"
                                          height="150px"
                                          title={`Prescription-${i}-${idx}`}
                                          style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                                        ></iframe>
                                      ) : (
                                        <img
                                          src={`${API_URL}${fileUrl}`}
                                          alt={`${p.title}-${idx}`}
                                          style={{ width: "100px", height: "auto", borderRadius: "8px" }}
                                        />
                                      )}
                                      <div className="mt-2">
                                        <a
                                          href={`${API_URL}${fileUrl}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn btn-sm btn-outline-primary"
                                        >
                                          View
                                        </a>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ flex: "0 0 45%" }}>
                                    {p.file.endsWith(".pdf") ? (
                                      <iframe
                                        src={`${API_URL}${p.file}`}
                                        width="100%"
                                        height="150px"
                                        title={`Prescription-${i}`}
                                        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
                                      ></iframe>
                                    ) : (
                                      <img
                                        src={`${API_URL}${p.file}`}
                                        alt={p.title}
                                        style={{ width: "100px", height: "auto", borderRadius: "8px" }}
                                      />
                                    )}
                                    <div className="mt-2">
                                      <a
                                        href={`${API_URL}${p.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-primary"
                                      >
                                        View
                                      </a>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <br />
                            <small>{new Date(p.date).toLocaleDateString()}</small>
                          </Card>
                        ))}
                      </Card>
                    )
                  ))
                )}
              </section>
            )} */}






          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

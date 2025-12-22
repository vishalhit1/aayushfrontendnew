import axios from "axios";
import { API_URL } from "../../config";

/* ---------------- USER API ---------------- */
const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Handle expired token */
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && token) {
      // Prevent redirect loop
      if (!window.location.href.includes("session=expired")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/session-expired";
      }
    }
    return Promise.reject(err);
  }
);


const doctorAPI = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

doctorAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("doctorToken"); // doctor token
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Handle expired doctor token */
doctorAPI.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && doctorToken) {
      localStorage.removeItem("doctorToken");
      localStorage.removeItem("doctor");

      window.location.href = "/doctor/login?session=expired";
    }
    return Promise.reject(err);
  }
);

export default API;

export {doctorAPI}



import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotResetPage from "./components/ForgotResetPage.jsx";

import Doctors from "./pages/SpecialistDoctor/Doctors.jsx";
import DoctorDetail from "./pages/SpecialistDoctor/DoctorDetail.jsx";
import LabTests from "./pages/LabTests.jsx";
import Profile from "./pages/Profile.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LabTestDetail from "./pages/LabTestDetail.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import StickySidebar from "./components/StickySidebar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import LabTestPaymentSuccess from "./pages/LabTestPaymentSuccess.jsx";

import "./styles/dashboard.css";
import DashboardWrapper from "./components/DashboardWrapper.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import AddressPage from "./pages/SpecialistDoctor/AddressPage.jsx";
import PatientPage from "./pages/SpecialistDoctor/PatientPage.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import BookingDetails from "./pages/BookingDetails.jsx";
import DoctorLogin from "./pages/auth/DoctorLogin.jsx";
import DoctorRegister from "./pages/auth/DoctorRegister.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx";

import LobbyDoctorStart from "./pages/LobbyDoctor/LobbyDoctorStart.jsx"
import LobbyDoctorPatient from "./pages/LobbyDoctor/LobbyDoctorPatient.jsx"
import LobbyDoctorSlot from "./pages/LobbyDoctor/LobbyDoctorSlot.jsx"
import LobbyDoctorAddress from "./pages/LobbyDoctor/LobbyDoctorAddress.jsx"
import LobbyDoctorCheckout from "./pages/LobbyDoctor/LobbyDoctorCheckout.jsx"
import LobbyDoctorCategory from "./pages/LobbyDoctor/LobbyDoctorCategory.jsx";
import LobbyDoctorPreferences from "./pages/LobbyDoctor/LobbyDoctorPreferences.jsx";
import SlotPicker from "./pages/SpecialistDoctor/SlotPicker.jsx";
import Doctorcheckout from "./pages/SpecialistDoctor/Doctorcheckout.jsx";
import TestPage from "./pages/TestPage.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import AgoraVideoCall from "./pages/Agora/AgoraVideoCall.jsx";
import AgoraAudioCall from "./pages/Agora/AgoraAudioCall.jsx";
import AgoraChatConsultation from "./pages/Agora/AgoraChatConsultation.jsx";
import DoctorAudioCall from "./pages/Agora/DoctorAudioCall.jsx";
import DoctorVideoCall from "./pages/Agora/DoctorVideoCall.jsx";
import DoctorChatConsultation from "./pages/Agora/DoctorChatConsultation.jsx";
import Footer from "./pages/Footer.jsx";
import Header from "./components/Header.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Blogs from "./pages/Blogs.jsx";
import LabTestSlot from "./pages/LabTestSlot.jsx";
import LabtestAddressPage from "./pages/LabtestAddressPage.jsx";
import LabtestPatientPage from "./pages/LabtestPatientPage.jsx";
import Individualtestdetails from "./pages/Testdetails/Individualtestdetails.jsx";
import Individualtestlist from "./pages/Individualtestlist.jsx";
import DoctorForgotResetPage from "./pages/auth/DoctorForgotResetPage.jsx";
import ScrollToTop from "./pages/ScrollToTop.jsx";
import Preference from "./pages/SpecialistDoctor/Preference.jsx";
import LabTestCart from "./pages/LabTestCart.jsx";
import DoctorBookingDetails from "./pages/DoctorBookingDetails.jsx";
import LabBookingDetails from "./pages/LabBookingDetails.jsx";
import Packagetestlist from "./pages/Packagetestlist.jsx";

import DoctorConsultation from "./pages/DoctorConsultation.jsx";
import DoctorCategoryList from "./pages/DoctorCategoryList.jsx";
import SearchDetails from "./pages/Search/SearchDetails.jsx";
import LabCategories from "./pages/Labtests/Labtests/LabCategories.jsx";
import BookingCancelled from "./pages/BookingCancelled.jsx";
import LabTestCheckout from "./pages/LabTestCheckout.jsx";
import LabSectionViewAll from "./pages/Labtests/LabSectionViewAll.jsx";
import Packagetestdetails from "./pages/Testdetails/Packagetestdetails.jsx";
import PrescriptionUploadPreviewPage from "./pages/Labtests/Labtests/PrescriptionUploadPreviewPage.jsx";
import HolisticPackageDetails from "./pages/Testdetails/HolisticPackageDetails.jsx";
import SearchResults from "./components/SearchResults.jsx";
import AgeCategoryList from "./pages/Home/age-test/AgeCategoryList.jsx";
import ScreenTestsListPage from "./pages/Testdetails/ScreenTestsListPage.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsandCondition from "./pages/TermsAndCondition.jsx";
import CancellationPolicy from "./pages/CancellationPolicy.jsx";
import BlogDetails from "./pages/BlogDetails.jsx";
import PaymentProcessing from "./pages/PaymentProcessing.jsx";



function Layout() {
  const location = useLocation();
  const hideHeaderFooter =
    ['/doctor/login', '/doctor/register'].includes(location.pathname) ||
    location.pathname.startsWith('/reset-password/') || location.pathname.startsWith('/doctor-reset-password/');


  return (
    <>
      {!hideHeaderFooter && <Header />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-condition" element={<TermsandCondition />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password/:token" element={<ForgotResetPage />} />

        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor-reset-password/:token" element={<DoctorForgotResetPage />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />

        <Route path="/search-details" element={<SearchDetails />} />

        <Route path="/search" element={<SearchResults />} />


        <Route path="/doctor-consultation" element={<DoctorConsultation />} />

        <Route path="/doctor-category" element={<DoctorCategoryList />} />

        <Route path="/testpage" element={<TestPage />} />

        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/lab-payment-success" element={<LabTestPaymentSuccess />} />

        <Route path="/consultation/video" element={<AgoraVideoCall />} />

        <Route path="/consultation/audio" element={<AgoraAudioCall />} />

        <Route path="/consultation/chat" element={<AgoraChatConsultation />} />

        <Route path="/doctorconsultation/video" element={<DoctorVideoCall />} />

        <Route path="/doctorconsultation/audio" element={<DoctorAudioCall />} />

        <Route path="/doctorconsultation/chat" element={<DoctorChatConsultation />} />


        <Route path="/labtestdetail" element={<LabTestDetail />} />
        <Route path="/Packagetestlist" element={<Packagetestlist />} />
        <Route path="/holisticpackagedetails/:id" element={<HolisticPackageDetails />} />


        <Route path="/individualtestdetails/:id" element={<Individualtestdetails />} />
        <Route path="/individualtestlist" element={<Individualtestlist />} />
        <Route path="/Packagetestdetails/:id" element={<Packagetestdetails />} />
        <Route path="/age-tests/:gender/:range" element={<AgeCategoryList />} />
        <Route path="/screenTestList/:name" element={<ScreenTestsListPage />} />


        {/* cms sections route */}
        <Route path="/lab/section/:id" element={<LabSectionViewAll />} />


        <Route path="/lobby-doctor" element={<LobbyDoctorStart />} />

        <Route path="/doctors" element={<Doctors />} />

        <Route path="/labtests/category/:id" element={<LabCategories />} />

        <Route path="/booking-cancelled" element={<BookingCancelled />} />

        <Route path="/prescription" element={<PrescriptionUploadPreviewPage />} />



        {/* Dashboard Routes (only visible when logged in) */}

        {/* <Route path="/doctor/dashboard" element={<DoctorDashboard />} /> */}
        {/* Protected routes */}
        <Route
          path="/lobby-doctor"
          element={
            <PrivateRoute role="user">
              <LobbyDoctorStart />
            </PrivateRoute>
          }
        />
        <Route
          path="/lobby-doctor/category"
          element={
            <PrivateRoute role="user">
              <LobbyDoctorCategory />
            </PrivateRoute>
          }
        />
        <Route
          path="/lobby-doctor/preference"
          element={
            <PrivateRoute role="user">
              <LobbyDoctorPreferences />
            </PrivateRoute>
          }
        />
        <Route
          path="/lobby-doctor/patient"
          element={
            <PrivateRoute role="user">
              <LobbyDoctorPatient />
            </PrivateRoute>
          }
        />

        <Route
          path="/lab/slot"
          element={
            <PrivateRoute role="user">
              <LabTestSlot />
            </PrivateRoute>
          }
        />

        <Route
          path="/lobby-doctor/slot"
          element={
            <PrivateRoute role="user">
              <LobbyDoctorSlot />
            </PrivateRoute>
          }
        />
        <Route
          path="/lobby-doctor/address"
          element={
            <PrivateRoute role="user">
              <LobbyDoctorAddress />
            </PrivateRoute>
          }
        />
        <Route
          path="/lobby-doctor/checkout"
          element={
            <PrivateRoute role="user">
              <LobbyDoctorCheckout />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctors/:id"
          element={
            <PrivateRoute role="user">
              <DoctorDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/slot/:id"
          element={
            <PrivateRoute role="user">
              <SlotPicker />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/preference"
          element={
            <PrivateRoute role="user">
              <Preference />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient-details"
          element={
            <PrivateRoute role="user">
              <PatientPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/address-detail"
          element={
            <PrivateRoute role="user">
              <AddressPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor-checkout"
          element={
            <PrivateRoute role="user">
              <Doctorcheckout />
            </PrivateRoute>
          }
        />

        <Route
          path="/lab-tests"
          element={
            // <PrivateRoute role="user">
            <LabTests />
            // </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute role="user">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            // <PrivateRoute role="user">
            <Cart />
            // </PrivateRoute>
          }
        />

        <Route
          path="/labtest-cart"
          element={
            // <PrivateRoute role="user">
            <LabTestCart />
            // </PrivateRoute>
          }
        />

        <Route
          path="/labtest-address-detail"
          element={
            // <PrivateRoute role="user">
            <LabtestAddressPage />
            // </PrivateRoute>
          }
        />
        <Route
          path="/labtest-patient-detail"
          element={
            // <PrivateRoute role="user">
            <LabtestPatientPage />
            // </PrivateRoute>
          }
        />

        <Route
          path="/lab/checkout"
          element={
            <PrivateRoute role="user">
              <LabTestCheckout />
            </PrivateRoute>
          }
        />


        <Route
          path="/checkout"
          element={
            <PrivateRoute role="user">
              <Checkout />
            </PrivateRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            // <PrivateRoute role="user">
              <MyBookings />
            // </PrivateRoute>
          }
        />
        <Route
          path="/booking/:type/:id"
          element={
            <PrivateRoute role="user">
              <BookingDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking/doctor/:id"
          element={
            <PrivateRoute role="user">
              <DoctorBookingDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking/lab/:id"
          element={
            <PrivateRoute role="user">
              <LabBookingDetails />
            </PrivateRoute>
          }
        />
        {/* Doctor-only dashboard */}
        <Route
          path="/doctor/dashboard"
          element={
            <PrivateRoute role="doctor">
              <DoctorDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

function App() {

  const { user } = useContext(AuthContext);

  return (
    // <AuthProvider>
    //   <CartProvider>
    <Router>
      <ToastContainer />
      <Layout />
    </Router>
    //   </CartProvider>
    // </AuthProvider>
  );
}

export default App;
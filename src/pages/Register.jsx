import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../lib/firebase"; // your firebase config file
import { registerWithOTP } from "../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isRegistered } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Only create reCAPTCHA once
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible", // or "normal"
          callback: () => {
            console.log("reCAPTCHA solved");
          },
        }
      );
    }
  };

  const sendOTP = async () => {
    try {
      if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
        alert("Please enter a valid 10-digit phone number");
        return;
      }
      setupRecaptcha();

      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + formData.phoneNumber,
        appVerifier
      );

      // ✅ Store globally so verify step can access it
      window.confirmationResult = confirmationResult;
      alert("OTP sent successfully to +" + formData.phoneNumber);
    } catch (err) {
      console.error("Error sending OTP:", err);
      alert("Failed to send OTP");
    }
  };

  const verifyOTP = async () => {
    try {
      const res = await window.confirmationResult.confirm(otp);

      // ✅ Correct: get Firebase ID token
      const idToken = await res.user.getIdToken();

      // ✅ Send idToken in body (not token)
       dispatch(
    registerWithOTP({
      token: idToken, // CHANGED: from 'idToken' to 'token'
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      role: "member",
      status: "false",
    })
  );
      navigate("/login"); // Redirect after successful registration
    } catch (err) {
      console.error("OTP verification failed:", err);
      alert("OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Recaptcha container */}
        <div id="recaptcha-container" className="mb-4"></div>

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register with Mobile OTP
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Name */}
        <input
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        {/* Email */}
        <input
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Mobile */}
        <input
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          name="phoneNumber"
          placeholder="10-digit Mobile Number"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <button
          className="bg-gradient-to-r from-teal-600 to-green-600 text-white font-medium p-3 w-full rounded-lg mb-4"
          onClick={sendOTP}
        >
          Send OTP
        </button>

        {/* OTP */}
        <input
          className="border border-gray-300 p-3 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="bg-gradient-to-r from-teal-600 to-green-600 text-white font-medium p-3 w-full rounded-lg"
          onClick={verifyOTP}
          disabled={loading}
        >
          {loading ? "Registering..." : "Verify & Register"}
        </button>

        {isRegistered && (
          <p className="text-green-500 mt-4 text-center font-medium">
            Registered Successfully!
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;

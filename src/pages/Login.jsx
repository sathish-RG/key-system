import React, { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginWithOTP } from "../redux/features/auth/authSlice";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
      window.recaptchaVerifier.render().catch(console.error);
    }
  }, []);

  const sendOTP = async () => {
    if (!phone) {
      alert("Please enter phone number");
      return;
    }

    try {
      const fullPhone = phone.startsWith("+91")
        ? phone
        : "+91" + phone.replace(/\D/g, "");

      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        window.recaptchaVerifier
      );

      setConfirmationResult(result);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("OTP Send Error:", error);
      alert(error.message || "Failed to send OTP");
    }
  };

  const verifyOTP = async () => {
    if (!confirmationResult) {
      alert("Please request OTP first.");
      return;
    }

    try {
      const userCredential = await confirmationResult.confirm(otp);
      const token = await userCredential.user.getIdToken();

      dispatch(loginWithOTP({ token, phoneNumber: phone }))
        .unwrap()
        .then((res) => {
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify({
            name: res.user.name,
            email: res.user.email,
            username: res.user.username,
            role: res.user.role
          }));
          localStorage.setItem("role", res.user.role);

          navigate(res.user.role === "admin" ? "/admin" : "/member");
        })
        .catch((err) => alert(err || "Login failed"));
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

      {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

      <input
        type="number"
        placeholder="Enter Mobile Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      <button
        onClick={sendOTP}
        disabled={loading || !phone}
        className="bg-gradient-to-r from-teal-600 to-green-600 text-white p-2 w-full mb-4 rounded hover:bg-teal-600 transition"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>

      <div id="recaptcha-container" className="mb-4"></div>

      <input
        type="number"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      <button
        onClick={verifyOTP}
        disabled={loading || !otp}
        className="bg-gradient-to-r from-teal-600 to-green-600 text-white p-2 w-full rounded hover:bg-green-600 transition"
      >
        {loading ? "Verifying..." : "Verify & Login"}
      </button>
    </div>
  );
};

export default Login;
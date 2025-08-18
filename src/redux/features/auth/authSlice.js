// src/redux/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = "http://localhost:5001/api/auth"

// ✅ Get initial state from localStorage
const getInitialState = () => {
  try {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")

    return {
      user: role ? { role } : null,
      token: token || null,
      loading: false,
      error: null,
      isRegistered: false,
      isLoggedIn: Boolean(token && role),
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error)
    return {
      user: null,
      token: null,
      loading: false,
      error: null,
      isRegistered: false,
      isLoggedIn: false,
    }
  }
}

// ---------------- REGISTER ----------------
export const registerWithOTP = createAsyncThunk(
  "auth/registerWithOTP",
  // The arguments here are what you pass when you dispatch the action
  async ({ token, name, email, phoneNumber, role, status }, { rejectWithValue }) => {
    try {
      console.log("--- SENDING REGISTRATION DATA ---", { idToken: token, name, phoneNumber });

      const res = await axios.post(`${API_URL}/register`, {
        idToken: token,       // This was correct
        name,       // CHANGED: from 'username' to 'fullName' to match backend
        email,
        phoneNumber, // CHANGED: from 'mobileNumber' to 'phoneNumber'
        role,                 // Note: Backend doesn't use these, but it's okay to send
        status,
      });

      // ✅ Save to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);


// ---------------- LOGIN ----------------
export const loginWithOTP = createAsyncThunk(
  "auth/loginWithOTP",
  // 💡 Bonus Fix: Your login also has a similar issue!
  async ({ token, phoneNumber, rememberMe = true }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_URL}/login`,
        // Your backend login expects `phoneNumber` but the thunk wasn't sending it.
        { idToken: token, phoneNumber, rememberMe }, // CHANGED: added phoneNumber
        { withCredentials: true }
      );

      // ✅ Save to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);


// ---------------- SLICE ----------------
const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isRegistered = false
      state.isLoggedIn = false
      try {
        localStorage.removeItem("token")
        localStorage.removeItem("role")
      } catch (error) {
        console.error("Error clearing localStorage:", error)
      }
    },
    hydrateAuth: (state) => {
      try {
        const token = localStorage.getItem("token")
        const role = localStorage.getItem("role")

        if (token && role) {
          state.user = { role }
          state.token = token
          state.isLoggedIn = true
        }
      } catch (error) {
        console.error("Error hydrating auth state:", error)
        state.user = null
        state.token = null
        state.isLoggedIn = false
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------- REGISTER ----------
      .addCase(registerWithOTP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerWithOTP.fulfilled, (state, action) => {
        state.loading = false
        state.isRegistered = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.isLoggedIn = true
      })
      .addCase(registerWithOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ---------- LOGIN ----------
      .addCase(loginWithOTP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginWithOTP.fulfilled, (state, action) => {
        state.loading = false
        state.isLoggedIn = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginWithOTP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { logout, hydrateAuth, clearError } = authSlice.actions
export default authSlice.reducer

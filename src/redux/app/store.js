// store/index.js or store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { hydrateAuth } from "../features/auth/authSlice";
import chapterReducer from "../features/chapters/chapterSlice";
import courseReducer from "../features/coures/courseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chapters: chapterReducer,
    courses: courseReducer,
  },
});

// 🔧 CRITICAL: Hydrate auth state from localStorage on store creation
console.log("🏪 Store created, hydrating auth state...");
store.dispatch(hydrateAuth());

export default store;
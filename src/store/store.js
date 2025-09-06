import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";  // corrected path

const store = configureStore({
  reducer: {
    auth: authReducer
  }
});

export default store;

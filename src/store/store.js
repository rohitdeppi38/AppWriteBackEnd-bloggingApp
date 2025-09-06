import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice.js";  // corrected path

const store = configureStore({
  reducer: {
    auth: authReducer,
    //post:postSlice
  }
});

export default store;

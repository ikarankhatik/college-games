import { createSlice } from "@reduxjs/toolkit";

const principleSlice = createSlice({
  name: "principle",
  initialState: {
    isLoggedIn: false, // Initial state is set to false as the user is not logged in initially
  },
  reducers: {
    login: (state, action) => {
      // Update the isLoggedIn state to true when the user logs in
      state.isLoggedIn = true;
    },
    logout: (state, action) => {
      // Update the isLoggedIn state to false when the user logs out
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = principleSlice.actions;

export default principleSlice.reducer;

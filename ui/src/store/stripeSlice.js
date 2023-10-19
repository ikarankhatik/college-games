import { createSlice } from "@reduxjs/toolkit";


const stripeSlice = createSlice({
  name: "stripe",
  initialState: {
    isSubscribed: false, // Initial state is set to false as the user is not subscribed in initially
  },
  reducers: {
    subscribed: (state, action) => {
      // Update the isSubscribed state to true when the user subscribed in
      console.log("payment");
      state.isSubscribed = true;
    },
    unsubscribed: (state, action) => {
      // Update the isSubscribed state to false when the user unsubcribed out
      state.isSubscribed = false;
    },
  },
});

export const { subscribed, unsubscribed } = stripeSlice.actions;

export default stripeSlice.reducer;


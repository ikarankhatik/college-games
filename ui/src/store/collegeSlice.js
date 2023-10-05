import { createSlice } from '@reduxjs/toolkit';

const collegeSlice = createSlice({
  name: 'colleges',
  initialState: [],
  reducers: {
    addCollege: (state, action) => {

      const dataToAdd = Array.isArray(action.payload) ? action.payload : [action.payload];

      for (const collegeToAdd of dataToAdd) {
        const existingCollegeIndex = state.findIndex(college => college._id === collegeToAdd._id);

        if (existingCollegeIndex !== -1) {
          // If the college exists, update it instead of adding a new one
          state[existingCollegeIndex] = collegeToAdd;
        } else {
          // If it doesn't exist, add it to the state
          state.push(collegeToAdd);
        }
      }
    },
    deleteCollege: (state, action) => {
      return state.filter(college => college._id !== action.payload);
    },
    updateCollge: (state, action) => {
      const index = state.findIndex(college => college._id === action.payload._id);

      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    }
  },
});

export const { addCollege, deleteCollege, updateCollge } = collegeSlice.actions;
export default collegeSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
  name: "students",
  initialState: [],
  reducers: {
    addStudent: (state, action) => {
      const dataToAdd = Array.isArray(action.payload) ? action.payload : [action.payload];

      for (const studentToAdd of dataToAdd) {
        const existingStudentIndex = state.findIndex(student => student._id === studentToAdd._id);

        if (existingStudentIndex !== -1) {
          // If the college exists, update it instead of adding a new one
          state[existingStudentIndex] = studentToAdd;
        } else {
          // If it doesn't exist, add it to the state
          state.push(studentToAdd);
        }
      }
    },
    updateStudent: (state, action) => {
      const index = state.findIndex(student => student._id === action.payload._id);

      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteStudent: (state, action) => {
      return state.filter(students => students._id !== action.payload);
    },
  },
});

export const { addStudent, updateStudent, deleteStudent } = studentSlice.actions;

export default studentSlice.reducer;

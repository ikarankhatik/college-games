import { createSlice } from '@reduxjs/toolkit';

const competitionSlice = createSlice({
  name: 'competitions',
  initialState: {
    competitions: [],
  },
  reducers: {
    addCompetition: (state, action) => {
      state.competitions.push(action.payload);
    },
    deleteCompetition: (state, action) => {
      state.competitions = state.competitions.filter(
        (competition) => competition._id !== action.payload
      );
    },
    addStudentCompetition: (state, action) => {
      const { id, studentID } = action.payload;
    
      // Find the index of the competition by its ID
      const competitionIndex = state.competitions.findIndex(
        (competition) => competition._id === id
      );
    
      // If the competition is found, check if the studentID is already in the students array
      if (competitionIndex !== -1) {
        const competition = state.competitions[competitionIndex];
        const isStudentAlreadyAdded = competition.students.includes(studentID);
    
        if (!isStudentAlreadyAdded) {
          // Add the studentID to the students array if it's not already there
          competition.students.push(studentID);
        }
      }
    },
    
  },
});

export const { addCompetition, deleteCompetition, addStudentCompetition } = competitionSlice.actions;

export default competitionSlice.reducer;

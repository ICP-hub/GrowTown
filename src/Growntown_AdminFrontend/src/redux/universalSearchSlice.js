import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  universalSearchData: {}
};

const universalSearchSlice = createSlice({
  name: "universalSearch",
  initialState,
  reducers: {
    addUniversalSearchData: (state, action) => {
      state.universalSearchData = action.payload; // Update search data
    },
  },
});

// Export actions
export const { addUniversalSearchData } = universalSearchSlice.actions;

// Export reducer
export default universalSearchSlice.reducer;

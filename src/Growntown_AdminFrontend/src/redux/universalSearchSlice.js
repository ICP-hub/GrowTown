import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nftSearchData: {},
  userSearchData:{}
};

const universalSearchSlice = createSlice({
  name: "universalSearch",
  initialState,
  reducers: {
    addNftSearchData: (state, action) => {
      state.nftSearchData = action.payload; // Update search data
    },
    addUserSearchData: (state, action) => {
      state.userSearchData = action.payload; // Update search data
    },
  },
});

// Export actions
export const { addNftSearchData,addUserSearchData } = universalSearchSlice.actions;

// Export reducer
export default universalSearchSlice.reducer;

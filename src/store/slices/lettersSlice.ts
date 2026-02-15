import { createSlice } from "@reduxjs/toolkit";

type StateType = {
  showFilters: boolean;
};

const initialState: StateType = {
  showFilters: false,
};

const letterSlice = createSlice({
  name: "letters",
  initialState,
  reducers: {
    toggleFilters: (state) => {
      state.showFilters = !state.showFilters;
    },
  },
});

export const { toggleFilters } = letterSlice.actions;

export default letterSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import letterSlice from "./slices/lettersSlice";

export const store = configureStore({
  reducer: {
    letters: letterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

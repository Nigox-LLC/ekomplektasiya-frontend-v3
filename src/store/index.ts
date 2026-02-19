import { configureStore } from "@reduxjs/toolkit";
import letterSlice from "./slices/lettersSlice";
import infoSlice from "./slices/infoSlice";

export const store = configureStore({
  reducer: {
    letters: letterSlice,
    info: infoSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

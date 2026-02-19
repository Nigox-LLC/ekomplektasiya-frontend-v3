import { createSlice } from "@reduxjs/toolkit";

interface IInfoState {
  currentUserInfo: {
    department: string;
    district: string;
    full_name: string;
    id: number;
    is_active: boolean;
    position: string;
    region: string;
    role: string;
    user_permissions: string[];
    username: string;
  };
  eimzoRememberedCert: SavedEimzoCert | null;
  eimzoSigningData: any;
}

const initialState: IInfoState = {
  currentUserInfo: {
    department: "",
    district: "",
    full_name: "",
    id: 0,
    is_active: false,
    position: "",
    region: "",
    role: "",
    user_permissions: [],
    username: "",
  },
  eimzoRememberedCert: null,
  eimzoSigningData: null,
};

const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    setCurrentUserInfo: (state, action) => {
      state.currentUserInfo = action.payload;
    },

    setEimzoRememberedCert(state, action) {
      state.eimzoRememberedCert = action.payload;
    },

    setEimzoSigningData(state, action) {
      state.eimzoSigningData = action.payload;
    },

    clearEimzoRememberedCert(state) {
      state.eimzoRememberedCert = null;
      state.eimzoSigningData = null;
    },
  },
});

export const {
  setCurrentUserInfo,
  setEimzoRememberedCert,
  setEimzoSigningData,
  clearEimzoRememberedCert,
} = infoSlice.actions;
export default infoSlice.reducer;

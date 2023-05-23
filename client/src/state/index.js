import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null;
    },
  },
});

export const { setLogin, setLogout, getUser } = globalSlice.actions;
export default globalSlice.reducer;

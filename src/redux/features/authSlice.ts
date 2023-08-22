import { UserDataTypes } from "@/types/general.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/* ====================================================== */

export interface AuthState {
  user: UserDataTypes;
}

const initialState: AuthState = {
  user: {
    uid: "",
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: "",
    wallpaper: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDataTypes>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

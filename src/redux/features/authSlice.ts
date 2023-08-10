import { TUser } from "@/types/general.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/* ====================================================== */

export interface AuthState {
  user: TUser;
}

const initialState: AuthState = {
  user: {
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;

import { TFollow, UserDataTypes } from "@/types/general.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  users: UserDataTypes[];
  userData: UserDataTypes;
  following: TFollow[];
  followers: TFollow[];
}

const initialState: UserState = {
  users: [],
  userData: {
    uid: "",
    email: "",
    username: "",
    role: "user",
    slug: "",
    photoURL: "",
    createdAt: "",
  },
  following: [],
  followers: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    storedUsers: (state, action: PayloadAction<UserDataTypes[]>) => {
      state.users = action.payload;
    },
    storedUserData: (state, action: PayloadAction<UserDataTypes>) => {
      state.userData = action.payload;
    },
    storedFollowing: (state, action: PayloadAction<TFollow[]>) => {
      state.following = action.payload;
    },
    storedFollowers: (state, action: PayloadAction<TFollow[]>) => {
      state.followers = action.payload;
    },
  },
});

export const { storedUsers, storedUserData, storedFollowers, storedFollowing } =
  userSlice.actions;
export default userSlice.reducer;

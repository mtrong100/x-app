import { TPostData } from "@/types/general.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  posts: TPostData[];
}

const initialState: PostState = {
  posts: [],
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<TPostData[]>) => {
      state.posts = action.payload;
    },
  },
});

export const { setPosts } = postSlice.actions;
export default postSlice.reducer;

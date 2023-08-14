import { TPostData } from "@/types/general.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  posts: TPostData[];
  postItemData: TPostData;
}

const initialState: PostState = {
  posts: [],
  postItemData: {
    postId: "",
    content: "",
    photos: [],
    userId: "",
    createdAt: "",
  },
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<TPostData[]>) => {
      state.posts = action.payload;
    },
    storedPostData: (state, action: PayloadAction<TPostData>) => {
      state.postItemData = action.payload;
    },
  },
});

export const { setPosts, storedPostData } = postSlice.actions;
export default postSlice.reducer;

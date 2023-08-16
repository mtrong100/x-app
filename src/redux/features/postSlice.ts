import { TComment, TPostData } from "@/types/general.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  posts: TPostData[];
  postItemData: TPostData;
  commentItemData: TComment;
  isUpdateCmt: boolean;
}

const initialState: PostState = {
  posts: [],
  isUpdateCmt: false,
  postItemData: {
    postId: "",
    content: "",
    photos: [],
    userId: "",
    createdAt: "",
  },
  commentItemData: {
    commentId: "",
    comment: "",
    commentImg: "",
    userId: "",
    postId: "",
    createdAt: null,
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
    storedCommentData: (state, action: PayloadAction<TComment>) => {
      state.commentItemData = action.payload;
    },
    setIsUpdateCmt: (state, action: PayloadAction<boolean>) => {
      state.isUpdateCmt = action.payload;
    },
  },
});

export const { setPosts, storedPostData, storedCommentData, setIsUpdateCmt } =
  postSlice.actions;
export default postSlice.reducer;

import { TComment, TFavorite, TPostData, TRepost } from "@/types/general.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PostState {
  posts: TPostData[];
  favoritePosts: TPostData[];
  repostPosts: TPostData[];

  repostData: TRepost[];
  favoriteData: TFavorite[];

  postItemData: TPostData;
  commentItemData: TComment;
  isUpdateCmt: boolean;
}

const initialState: PostState = {
  posts: [],
  favoritePosts: [],
  repostPosts: [],

  repostData: [],
  favoriteData: [],

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

  isUpdateCmt: false,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<TPostData[]>) => {
      state.posts = action.payload;
    },
    setFavoritePosts: (state, action: PayloadAction<TPostData[]>) => {
      state.favoritePosts = action.payload;
    },
    setRepostPosts: (state, action: PayloadAction<TPostData[]>) => {
      state.repostPosts = action.payload;
    },

    storedRepostData: (state, action: PayloadAction<TRepost[]>) => {
      state.repostData = action.payload;
    },
    storedFavoriteData: (state, action: PayloadAction<TFavorite[]>) => {
      state.favoriteData = action.payload;
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

export const {
  setPosts,
  storedPostData,
  storedCommentData,
  setIsUpdateCmt,
  storedRepostData,
  storedFavoriteData,
  setFavoritePosts,
  setRepostPosts,
} = postSlice.actions;
export default postSlice.reducer;

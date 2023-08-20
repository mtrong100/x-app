import { ChangeEvent } from "react";
/* ====================================================== */

export type TSidebarLinks = {
  name: string;
  icon: JSX.Element;
  route: string;
};

export type TUserSignup = {
  username: string;
  email: string;
  password: string;
};

export type TUserSignin = {
  email: string;
  password: string;
};

export type UserDataTypes = {
  uid: string;
  email: string;
  username: string;
  role: "user" | "admin";
  slug: string;
  photoURL: string;
  createdAt: any;
};

export type TPostData = {
  postId: string;
  content: string;
  photos: string[];
  userId: string;
  createdAt: any;
};

export type TLikeData = {
  id: string;
  postId: string;
  userId: string;
  isLiked: boolean;
};

export type TSavePost = {
  postId: string;
  isSaved: boolean;
};

export type TRepost = {
  postId: string;
  isRepost: boolean;
};

export type TComment = {
  commentId: string;
  comment: string;
  commentImg: string;
  userId: string;
  postId: string;
  createdAt: any;
};

export interface IconDropdownProps {
  editItem: (data: any) => void;
  deleteItem: (data: any) => void;
  editText?: string;
  deleteText?: string;
  data: any;
}

export interface CommentItemProps {
  data: TComment;
  totalComment: number;
  index: number;
}

export interface UserMetaProps {
  username: string;
  slug: string;
  date: any;
}

export interface ImageDisplayProps {
  images: string[];
  hideIcon?: boolean;
  onClick?: (image: string) => void;
}

export type TFollow = {
  uid: string;
  isFollowing: boolean;
};

export interface SearchbarProps {
  className?: string;
  query?: string;
  handeSearchQuery?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export type TFavorite = {
  isLiked: false;
  postId: string;
};

export type TSaveData = {
  id: string;
  userId: string;
  postId: string;
  isSaved: boolean;
};

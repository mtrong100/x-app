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

export type TTabData = {
  value: string;
  name: string;
  icon: JSX.Element;
};

export interface PostActionProps {
  userId: string;
  postId: string;
}

export type TComment = {
  commentId: string;
  comment: string;
  commentImg: string;
  userId: string;
  postId: string;
  createdAt: any;
};

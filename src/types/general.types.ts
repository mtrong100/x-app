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

export type TTabData = {
  value: string;
  name: string;
  icon: JSX.Element;
};

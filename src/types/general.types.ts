export type TSidebarLinks = {
  name: string;
  icon: JSX.Element;
  route: string;
};

export type InputTypes = {
  username: string;
  email: string | number;
  password: string | number;
};

export type UserDataTypes = {
  email: string;
  username: string;
  role: "user" | "admin";
  slug: string;
  photoURL: string;
  createdAt: any;
};

import { BsFilePost } from "react-icons/bs";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";
import { MdPostAdd } from "react-icons/md";

export const tabData = [
  {
    name: "Posts",
    value: "posts",
    icon: <MdPostAdd />,
  },
  {
    name: "Reposts",
    value: "reposts",
    icon: <AiOutlineRetweet />,
  },
  {
    name: "Likes",
    value: "likes",
    icon: <AiOutlineHeart />,
  },
];

export const homeTab = [
  {
    name: "For you",
    value: "for you",
  },
  {
    name: "Following",
    value: "following",
  },
];

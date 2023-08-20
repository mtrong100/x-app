import { BsFilePost } from "react-icons/bs";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";

const tabData = [
  {
    name: "Posts",
    value: "post",
    icon: <BsFilePost />,
  },
  {
    name: "Reposts",
    value: "repost",
    icon: <AiOutlineRetweet />,
  },
  {
    name: "Likes",
    value: "like",
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

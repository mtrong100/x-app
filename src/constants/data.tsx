import {
  BookmarkIcon,
  HomeIcon,
  NotificationIcon,
  ProfileIcon,
  SearchIcon,
} from "@/components/icons/Icon";
import { BsFilePost } from "react-icons/bs";
import { AiOutlineHeart, AiOutlineRetweet } from "react-icons/ai";

export const sidebarLinks = [
  {
    name: "Home",
    icon: <HomeIcon />,
    route: "/",
  },
  {
    name: "Search",
    icon: <SearchIcon />,
    route: "/search",
  },
  {
    name: "Notification",
    icon: <NotificationIcon />,
    route: "/notification",
  },
  {
    name: "Bookmark",
    icon: <BookmarkIcon />,
    route: "/bookmark",
  },
  {
    name: "Profile",
    icon: <ProfileIcon />,
    route: `/profile`,
  },
];

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

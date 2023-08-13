import {
  BookmarkIcon,
  HomeIcon,
  NotificationIcon,
  ProfileIcon,
  SearchIcon,
} from "@/components/icons/Icon";
import { BsFilePostFill, BsFiletypeGif } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
/* ====================================================== */

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
    route: "/profile",
  },
];

export const tabData = [
  {
    value: "post",
    name: "Posts",
    icon: <BsFilePostFill />,
  },
  {
    value: "gif",
    name: "Gifs",
    icon: <BsFiletypeGif />,
  },
  {
    value: "like",
    name: "Likes",
    icon: <AiOutlineHeart />,
  },
];

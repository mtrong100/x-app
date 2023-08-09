import {
  BookmarkIcon,
  HomeIcon,
  NotificationIcon,
  ProfileIcon,
  SearchIcon,
} from "@/components/icons/Icon";

export const sidebarLinks = [
  {
    name: "Home",
    icon: <HomeIcon />,
    path: "/",
  },
  {
    name: "Search",
    icon: <SearchIcon />,
    path: "/search",
  },
  {
    name: "Notification",
    icon: <NotificationIcon />,
    path: "/home",
  },
  {
    name: "Bookmark",
    icon: <BookmarkIcon />,
    path: "/bookmark",
  },
  {
    name: "Profile",
    icon: <ProfileIcon />,
    path: "/profile",
  },
];

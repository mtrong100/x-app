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

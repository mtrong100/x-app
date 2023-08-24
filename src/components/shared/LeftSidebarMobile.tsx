"use client";
import { TSidebarLinks } from "@/types/general.types";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "../logo/Logo";
import Swal from "sweetalert2";
import { EllipsisIcon, LogoutIcon } from "../icons/Icon";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";
import Button from "../button/Button";
import { useDisclosure } from "@nextui-org/react";
import CreatePost from "@/modules/post/CreatePost";
import {
  BookmarkIcon,
  HomeIcon,
  NotificationIcon,
  ProfileIcon,
  SearchIcon,
} from "@/components/icons/Icon";
import { AiOutlinePlus } from "react-icons/ai";
import UserAvatar from "@/modules/user/UserAvatar";
/* ====================================================== */

const LeftSidebarMobile = () => {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const addPost = () => {
    onOpen();
  };

  const sidebarLinks = [
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
      route: `/${user.slug}`,
    },
  ];

  return (
    <>
      <div className="sticky flex-col hidden lg:flex xl:hidden left-0 top-0 w-[80px] h-screen z-20 overflow-auto border-r border-text_2 bg-primaryGradient p-2">
        <ul className="flex flex-col items-center flex-1 gap-4 ">
          <Link href="/">
            <Image
              className="rounded-full w-[50px] h-[50px] flex items-center justify-center hover:bg-darkHover"
              src="/logo.png"
              alt="x-logo"
              width={40}
              height={40}
            />
          </Link>
          {sidebarLinks.map((link: TSidebarLinks) => {
            const isActive = pathname === link.route;
            return (
              <Link
                key={link.name}
                href={link.route}
                className={`${
                  isActive
                    ? "bg-primaryColor text-white"
                    : "hover:bg-darkHover text-cloudGray hover:text-white"
                } flex items-center gap-3 h-[50px] w-[50px] text-lg font-medium justify-center  rounded-full`}
              >
                <span>{link.icon}</span>
              </Link>
            );
          })}
          <Signout />
          <li
            onClick={addPost}
            className={`flex items-center gap-3 bg-primaryColor text-white h-[50px] w-[50px] text-lg font-medium justify-center  rounded-full`}
          >
            <span className="text-xl">
              <AiOutlinePlus />
            </span>
          </li>
        </ul>
        {/* User */}
        <li className="flex items-center justify-between w-full p-2 rounded-full cursor-pointer hover:bg-darkHover ">
          <div className="flex items-center gap-3">
            <UserAvatar avatar={user?.photoURL} />
          </div>
        </li>
      </div>
      <CreatePost
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onClose={onClose}
      ></CreatePost>
    </>
  );
};

export default LeftSidebarMobile;

// Sign out
function Signout() {
  const router = useRouter();

  const handleSignout = () => {
    Swal.fire({
      title: "Log out of your account?",
      text: "You'll need to log in again to access it later!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, sign me out!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        signOut(auth);
        router.push("/sign-in");
      }
    });
  };

  return (
    <li
      onClick={handleSignout}
      className={`flex items-center cursor-pointer gap-3 py-3 text-lg font-semibold px-5 w-full rounded-full hover:bg-darkHover text-cloudGray hover:text-white`}
    >
      <span>
        <LogoutIcon />
      </span>
    </li>
  );
}

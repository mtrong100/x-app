"use client";
import React, { useState } from "react";
import { v4 } from "uuid";
import {
  BookmarkIcon,
  HomeIcon,
  NotificationIcon,
  SearchIcon,
} from "@/components/icons/Icon";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase";
import Swal from "sweetalert2";
import { AiOutlinePlus } from "react-icons/ai";
import CreatePost from "@/modules/post/CreatePost";
/* <===============================================================> */

const BottomBar = () => {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [show, setShow] = useState(false);
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

  const addPost = () => {
    onOpen();
  };

  // Nav Link Data
  const sidebarLinks = [
    {
      icon: <HomeIcon />,
      route: "/",
    },
    {
      icon: <SearchIcon />,
      route: "/search",
    },
    {
      icon: <AiOutlinePlus />,
      onClick: () => addPost(),
    },
    {
      icon: <NotificationIcon />,
      route: "/notification",
    },
    {
      name: "Bookmark",
      icon: <BookmarkIcon />,
      route: "/bookmark",
    },
  ];

  return (
    <section className="fixed bottom-0 w-full bg-primaryGradient lg:hidden py-3 z-[50]">
      <ul className="flex items-center justify-around gap-4 ">
        {sidebarLinks.map((link: any) => {
          const isActive = pathname === link.route;
          if (link.onClick) {
            return (
              <li
                key={v4()}
                onClick={link.onClick}
                className={`${
                  link.name === "toggle" ? "" : "bg-primaryColor text-white"
                } flex justify-center items-center cursor-pointer w-[40px] h-[40px] md:h-[50px] md:w-[50px] rounded-full  font-bold`}
              >
                <span className="text-2xl">{link.icon}</span>
              </li>
            );
          }

          return (
            <Link
              key={v4()}
              href={link.route}
              className={`${
                isActive
                  ? "bg-primaryColor text-white"
                  : "hover:bg-darkHover text-cloudGray hover:text-white"
              } flex items-center gap-3 w-[40px] h-[40px] md:h-[50px] md:w-[50px] font-medium justify-center rounded-full`}
            >
              <span className="md:text-lg">{link.icon}</span>
            </Link>
          );
        })}
      </ul>

      <CreatePost
        onOpenChange={onOpenChange}
        isOpen={isOpen}
        onClose={onClose}
      ></CreatePost>
    </section>
  );
};

export default BottomBar;

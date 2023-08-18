"use client";
import { TSidebarLinks } from "@/types/general.types";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { sidebarLinks } from "@/constants/data";
/* ====================================================== */

const LeftSidebar = () => {
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const addPost = () => {
    onOpen();
  };

  return (
    <>
      <div className="sticky flex flex-col left-0 top-0 w-[275px] h-screen z-20 overflow-auto border-r border-text_2 bg-primaryGradient p-5">
        <Logo />
        <ul className="flex flex-col items-stretch flex-1 gap-2">
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
                } flex items-center gap-3 py-3 text-lg font-medium px-5 w-full rounded-full`}
              >
                <span>{link.icon}</span>
                <div>{link.name}</div>
              </Link>
            );
          })}
          <Signout />
          <Button onClick={addPost} className="py-3 text-lg rounded-full">
            Post
          </Button>
        </ul>
        {/* User */}
        <li className="flex items-center justify-between w-full p-2 rounded-full cursor-pointer hover:bg-darkHover ">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full flex-shrink-0">
              <Image
                src={user?.photoURL || "/default-avatar.jpg"}
                width={100}
                height={100}
                alt="user-avatar"
                className="rounded-full img-cover"
              />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-white">{user?.username}</span>
              <p className="text-sm text-text_4">{`@${user?.slug}`}</p>
            </div>
          </div>
          <span>
            <EllipsisIcon className="text-white" />
          </span>
        </li>
      </div>
      <CreatePost isOpen={isOpen} onClose={onClose}></CreatePost>
    </>
  );
};

export default LeftSidebar;

// Sign out
function Signout() {
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
      <div>Logout</div>
    </li>
  );
}

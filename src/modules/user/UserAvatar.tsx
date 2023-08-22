import Image from "next/image";
import React from "react";
import { BiImageAdd } from "react-icons/bi";

interface UserAvatarProps {
  avatar: string;
  className?: string;
  hasIcon?: boolean;
}

const UserAvatar = ({
  avatar = "",
  className = "w-[45px] h-[45px]",
  hasIcon = false,
}: UserAvatarProps) => {
  return (
    <div className={`${className}  flex-shrink-0 rounded-full select-none `}>
      <Image
        className="rounded-full select-none img-cover"
        src={avatar || "https://source.unsplash.com/random"}
        width={300}
        height={300}
        alt="user-avatar"
      />
      {hasIcon && (
        <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex items-center justify-center w-[40px] h-[40px] bg-black bg-opacity-70  rounded-full text-lg hover:bg-black text-white cursor-pointer">
          <BiImageAdd />
        </div>
      )}
    </div>
  );
};

export default UserAvatar;

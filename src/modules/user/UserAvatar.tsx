import Image from "next/image";
import React from "react";

const UserAvatar = ({
  avatar = "",
  className = "w-[45px] h-[45px]",
}: {
  avatar: string;
  className?: string;
}) => {
  return (
    <div className={`${className} flex-shrink-0 rounded-full select-none `}>
      <Image
        className="rounded-full select-none img-cover"
        src={avatar || "https://source.unsplash.com/random"}
        width={300}
        height={300}
        alt="user-avatar"
      />
    </div>
  );
};

export default UserAvatar;

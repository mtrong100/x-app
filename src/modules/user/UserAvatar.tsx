import Image from "next/image";
import React from "react";

const UserAvatar = ({
  avatar = "https://source.unsplash.com/random",
}: {
  avatar: string;
}) => {
  return (
    <div className="w-[45px] h-[45px] rounded-full flex-shrink-0 select-none">
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

import Image from "next/image";
import React from "react";
import { BiImageAdd } from "react-icons/bi";

interface UserWallpaperProps {
  wallpaper?: string;
  className?: string;
  hasIcon?: boolean;
}

const UserWallpaper = ({
  wallpaper = "",
  className = "w-full h-[200px]",
  hasIcon = false,
}: UserWallpaperProps) => {
  return (
    <div className={`${className} `}>
      <Image
        className=" img-cover"
        src={wallpaper || "https://source.unsplash.com/random"}
        alt="wallpaper"
        width={300}
        height={300}
      />
      {hasIcon && (
        <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 flex items-center justify-center w-[40px] h-[40px] bg-black bg-opacity-70  rounded-full text-lg hover:bg-black text-white cursor-pointer">
          <BiImageAdd />
        </div>
      )}
    </div>
  );
};

export default UserWallpaper;

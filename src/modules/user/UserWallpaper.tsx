import Image from "next/image";
import React from "react";

const UserWallpaper = ({
  wallpaper = "",
  className = "w-full h-[200px]",
}: {
  wallpaper?: string;
  className?: string;
}) => {
  return (
    <div className={`${className}`}>
      <Image
        className="img-cover"
        src={wallpaper || "https://source.unsplash.com/random"}
        alt="wallpaper"
        width={300}
        height={300}
      />
    </div>
  );
};

export default UserWallpaper;

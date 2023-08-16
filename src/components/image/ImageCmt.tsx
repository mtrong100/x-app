import Image from "next/image";
import React from "react";
import { CloseIcon } from "../icons/Icon";

interface ImageCmtProps {
  onClick?: (image: string) => void;
  image: string;
}

const ImageCmt = ({ onClick, image }: ImageCmtProps) => {
  return (
    <div className="relative w-[250px]">
      <Image
        src={image}
        width={300}
        height={300}
        alt="image-from-user"
        className="object-contain rounded-lg"
      />
      {onClick && (
        <span onClick={() => onClick(image)} className="circle-icon">
          <CloseIcon />
        </span>
      )}
    </div>
  );
};

export default ImageCmt;

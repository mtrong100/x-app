import React from "react";
import Image from "next/image";
import { v4 } from "uuid";
import { ImageDisplayProps } from "@/types/general.types";
import { CloseIcon } from "../icons/Icon";

const ImageDisplay = ({
  images,
  hideIcon = true,
  onClick = () => {},
}: ImageDisplayProps) => {
  const [first, ...other] = images;
  return (
    <>
      {(images.length === 1 || images.length === 2 || images.length === 4) && (
        <div className={getGridClass(images.length)}>
          {images.map((image, index) => (
            <div key={v4()} className={getImageContainerClass(images.length)}>
              <Image
                src={image}
                width={500}
                height={500}
                alt={`user-avatar-${index + 1}`}
                className={`${
                  images.length === 1 ? "object-top" : ""
                } rounded-md img-cover`}
              />
              {hideIcon && (
                <span onClick={() => onClick(image)} className="circle-icon">
                  <CloseIcon />
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 3 && (
        <div className="grid items-center grid-cols-2 gap-1">
          <div className="relative w-full h-[310px] rounded-md">
            <Image
              src={first}
              width={500}
              height={500}
              alt="user-avatar"
              className="rounded-md img-cover"
            />
            {hideIcon && (
              <span onClick={() => onClick(first)} className="circle-icon">
                <CloseIcon />
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {other.map((image, index) => (
              <div className="relative w-full h-[153px] rounded-md" key={index}>
                <Image
                  src={image}
                  width={500}
                  height={500}
                  alt={`image-${index + 2}`}
                  className="rounded-md img-cover"
                />
                {hideIcon && (
                  <span onClick={() => onClick(image)} className="circle-icon">
                    <CloseIcon />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

const getGridClass = (imageCount: number) => {
  if (imageCount === 2 || imageCount === 4) {
    return "grid grid-cols-2 gap-1";
  }
};

const getImageContainerClass = (imageCount: number) => {
  switch (imageCount) {
    case 1:
      return "relative w-full h-[650px] min-h-[320px] rounded-md";
    case 2:
      return "relative w-full h-[300px] rounded-md";
    case 4:
      return "relative w-full h-[200px] rounded-md";

    default:
      return "";
  }
};

export default ImageDisplay;

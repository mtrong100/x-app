import Image from "next/image";
import React from "react";

const PostPreview = ({ photos }: { photos: string[] }) => {
  return (
    <div
      className={`grid gap-1 mt-2 ${
        photos.length === 1
          ? "grid-cols-1"
          : photos.length === 2 || photos.length === 3
          ? "grid-cols-2"
          : "grid-cols-4"
      }`}
    >
      {photos &&
        photos.length > 0 &&
        photos.map((image, index) => (
          <div key={index} className="relative w-full h-full rounded-lg">
            <Image
              src={image}
              width={300}
              height={300}
              alt="post-item"
              className="rounded-lg img-cover"
            />
          </div>
        ))}
    </div>
  );
};

export default PostPreview;

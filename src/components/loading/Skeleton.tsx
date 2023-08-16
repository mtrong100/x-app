import React from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps {
  className?: string;
  bgcolor?: "primary" | "secondary" | "third";
}

const Skeleton = ({ className = "", bgcolor = "primary" }: SkeletonProps) => {
  let bgClass = "";

  switch (bgcolor) {
    case "primary":
      bgClass = "bg-loadingGradient";
      break;
    case "secondary":
      bgClass = "bg-secondaryDark";
      break;
    default:
      bgClass = "";
      break;
  }

  return <div className={twMerge("animate-pulse", bgClass, className)}></div>;
};

export default Skeleton;

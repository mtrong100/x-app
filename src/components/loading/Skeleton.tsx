import React from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps {
  className?: string;
  bgColor?: "primary" | "secondary" | "third";
}

const Skeleton = ({ className = "", bgColor = "primary" }: SkeletonProps) => {
  let bgClass = "";

  switch (bgColor) {
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

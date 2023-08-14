import React from "react";
import { twMerge } from "tailwind-merge";

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => {
  return (
    <div
      className={twMerge("animate-pulse bg-loadingGradient", className)}
    ></div>
  );
};

export default Skeleton;

import React from "react";

interface LoadingProps {
  size?: string;
  color?: string;
  className?: string;
  border?: string;
}

const Loading = ({
  className = "",
  size = "w-6 h-6",
  border = "border-t-2 border-2",
  color = "border-white",
}: LoadingProps) => {
  return (
    <div
      className={`${className} ${size} ${border} ${color} animate-spin flex items-center justify-center mx-auto rounded-full  border-t-transparent  border-solid `}
    ></div>
  );
};

export default Loading;

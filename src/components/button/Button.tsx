import React, { ButtonHTMLAttributes } from "react";
import Loading from "../loading/Loading";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline-secondary";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "",
  className = "",
  onClick,
  type = "button",
  loading = false,
  ...props
}) => {
  let buttonStyle = "";
  switch (variant) {
    case "primary":
      buttonStyle =
        "bg-primaryColor text-white hover:bg-opacity-80 py-2 px-4 h-[48px] rounded-md focus:ring-primaryColor";
      break;
    case "secondary":
      buttonStyle =
        "px-5 hover:bg-opacity-80 text-sm rounded-full py-2 bg-white text-black focus:ring-slate-500";
      break;
    case "ghost":
      buttonStyle = "bg-transparent text-black hover:bg-opacity-10";
      break;
    case "outline-secondary":
      buttonStyle =
        "px-5 text-sm rounded-full py-2 border text-white hover:bg-white hover:bg-opacity-5  text-black focus:ring-slate-500";
      break;
    default:
      buttonStyle =
        "bg-primaryColor text-white hover:bg-opacity-80 px-5 focus:ring-primaryColor";
  }

  return (
    <button
      className={twMerge(
        "font-medium cursor-pointer focus:outline-none focus:ring transition-all flex items-center justify-center",
        buttonStyle,
        className
      )}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading ? <Loading /> : props.children}
    </button>
  );
};

export default Button;

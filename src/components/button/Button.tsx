import React, { ButtonHTMLAttributes } from "react";
import Loading from "../loading/Loading";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  loading = false,
  ...props
}) => {
  const buttonClasses = `
    ${className} 
    ${
      variant === "primary"
        ? "bg-primaryColor text-white hover:bg-opacity-90"
        : "bg-white text-black hover:bg-opacity-90"
    }
    py-2 px-4 h-[48px] rounded-md font-medium focus:outline-none focus:ring focus:ring-opacity-50
  `;

  return (
    <button className={buttonClasses} onClick={onClick} type={type} {...props}>
      {loading ? <Loading /> : props.children}
    </button>
  );
};

export default Button;

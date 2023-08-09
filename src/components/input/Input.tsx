import { InputTypes } from "@/types/general.types";
import React, { useState } from "react";
import { Control, useController } from "react-hook-form";
import { IconEye, IconEyeSlash } from "../icons/Icon";
import useToggle from "@/hooks/useToggleValue";

interface InputFieldProps {
  name: keyof InputTypes;
  control: Control<InputTypes>;
  placeholder?: string;
  type?: string;
  children?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  control,
  placeholder = "",
  type = "text",
  children,
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });

  return (
    <div className="relative w-full">
      <input
        {...field}
        type={type}
        placeholder={placeholder}
        className="w-full p-4 text-sm bg-transparent border rounded-sm outline-none focus:bg-darkGraphite border-text_2"
      />
      {children ? (
        <div className="absolute right-[15px] text-text_3 top-2/4 cursor-pointer -translate-y-2/4">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default InputField;

export const InputPasswordToggle = ({ control }: any) => {
  const { toggleValue: togglePassword, handleToggleValue } = useToggle();

  return (
    <InputField
      type={togglePassword ? "text" : "password"}
      name="password"
      placeholder="Enter your password"
      control={control}
    >
      {!togglePassword ? (
        <span className="text-xl" onClick={handleToggleValue}>
          <IconEyeSlash />
        </span>
      ) : (
        <span className="text-xl" onClick={handleToggleValue}>
          <IconEye />
        </span>
      )}
    </InputField>
  );
};

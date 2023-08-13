import React, { TextareaHTMLAttributes } from "react";
import { useController } from "react-hook-form";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  control: any;
  placeholder?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  name,
  placeholder = "",
  control,
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });

  return (
    <div className="mb-4">
      <textarea
        {...field}
        placeholder={placeholder}
        className="block w-full px-3 resize-none py-2 mt-1 text-gray-700 bg-white border rounded-md shadow-sm focus:ring focus:ring-opacity-50"
      ></textarea>
    </div>
  );
};

export default Textarea;

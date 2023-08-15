import React, { ChangeEvent, useState } from "react";

interface FileInputProps {
  handleSelectImage: (e: ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
}

const FileInput = ({ handleSelectImage, multiple = true }: FileInputProps) => {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="fileInput"
        className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:bg-white hover:bg-opacity-5 bg-primaryDark hover:shadow-md"
      >
        Choose File
      </label>
      <input
        id="fileInput"
        type="file"
        className="hidden-input"
        onChange={handleSelectImage}
        multiple={multiple}
      />
    </div>
  );
};

export default FileInput;

import React, { ChangeEvent, useState } from "react";

interface FileInputProps {
  handleSelectImage: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FileInput = ({ handleSelectImage }: FileInputProps) => {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="fileInput"
        className="cursor-pointer hover:bg-white hover:bg-opacity-5 text-sm font-medium bg-primaryDark rounded-md px-4 py-2 border border-gray-300 shadow-sm hover:shadow-md"
      >
        Choose File
      </label>
      <input
        id="fileInput"
        type="file"
        className="hidden-input"
        onChange={handleSelectImage}
        multiple
      />
    </div>
  );
};

export default FileInput;

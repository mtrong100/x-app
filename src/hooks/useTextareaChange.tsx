import { useState } from "react";

export default function useTextareaChange() {
  const [inputVal, setInputVal] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputVal(e.target.value);
  };

  return {
    setInputVal,
    inputVal,
    handleChange,
  };
}

import { useState } from "react";

export default function useToggle() {
  const [toggleValue, setToggleValue] = useState<boolean>(false);

  const handleToggleValue = () => {
    setToggleValue(!toggleValue);
  };

  return {
    toggleValue,
    handleToggleValue,
  };
}

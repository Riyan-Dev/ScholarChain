// useCounter.js
import { useState } from "react";
function useIsDisabled() {
  const [isDisabled, setIsDisabled] = useState(false);
  const toggle = () => setIsDisabled((prevState) => !prevState);
  const setTrue = () => setIsDisabled(true);
  return { isDisabled, toggle, setTrue };
}
export default useIsDisabled;

import { useCallback, useState } from "react";

const useToggleState = (initialState) => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  return [state, toggle];
};

export default useToggleState;

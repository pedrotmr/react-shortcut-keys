import { useCallback, useEffect } from "react";
import debouncedFn from "../utils/debounce-fn";
import { UseShortcutProps } from "../utils/types";

const useShortcut = ({
  keys,
  onKey,
  options,
  global = false,
}: UseShortcutProps) => {
  const keyList = Array.isArray(keys) ? keys : [keys];
  const { debounce, excludeSelectors, preventDefault } = options ?? {};

  const handleKeyDown = useCallback(
    (event) => {
      if (!keyList.includes(event.key)) return;
      if (preventDefault) event.preventDefault();
      if (excludeSelectors) {
        const targetElement = event.target as HTMLElement;
        if (excludeSelectors.some((selector) => document.querySelector(selector) && targetElement.matches(selector))) return;
      }
      onKey(event.key, event);
    },
    [keyList, onKey, debounce, preventDefault]
  );

  useEffect(() => {
    if (global) {
      const handler = debounce ? debouncedFn(handleKeyDown, debounce): handleKeyDown;
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
    }
  }, [global, debounce, handleKeyDown]);

  if (global) return;

  return debounce ? debouncedFn(handleKeyDown, debounce) : handleKeyDown;
};

export default useShortcut;

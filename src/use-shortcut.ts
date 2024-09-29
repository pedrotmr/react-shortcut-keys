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
      const pressedKey = event.key;
      const isModifierPressed = event.metaKey || event.ctrlKey;
      const matchedKey = keyList.find(key => {
        if (key.includes('+')) {
          const [modifier, k] = key.split('+');
          const isCommandOrControl = (modifier === 'cmd' || modifier === 'ctrl');
          return isCommandOrControl && isModifierPressed && k === pressedKey;
        } else {
          return key === pressedKey;
        }
      });

      if (!matchedKey) return;
      
      if (preventDefault) event.preventDefault();
      if (excludeSelectors) {
        const targetElement = event.target as HTMLElement;
        if (excludeSelectors.some((selector) => document.querySelector(selector) && targetElement.matches(selector))) return;
      }
      onKey(matchedKey, event);
    },
    [keyList, onKey, debounce, preventDefault]
  );


  const functionToCall = debounce ? debouncedFn(handleKeyDown, debounce): handleKeyDown;

  useEffect(() => {
    if (global) {
      document.addEventListener("keydown", functionToCall);
      return () => document.removeEventListener("keydown", functionToCall);
    }
  }, [global, debounce, functionToCall]);

  if (global) return;

  return functionToCall;
};

export default useShortcut;

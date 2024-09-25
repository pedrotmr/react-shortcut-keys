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

  const isMac = /(Mac)/i.test(navigator.userAgent)

  const handleKeyDown = useCallback(
    (event) => {
      const pressedKey = event.key;
      const isModifierPressed = isMac ? event.metaKey : event.ctrlKey;
      const matchedKey = keyList.find(key => {
        if (key.includes('+')) {
          const [modifier, k] = key.split('+');
          return (modifier === 'cmd' && isMac && isModifierPressed && k === pressedKey) ||
                 (modifier === 'ctrl' && !isMac && isModifierPressed && k === pressedKey);
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
    [keyList, onKey, debounce, preventDefault, isMac]
  );

  // const handleKeyDown = useCallback(
  //   (event) => {
  //     if (!keyList.includes(event.key)) return;
  //     if (preventDefault) event.preventDefault();
  //     if (excludeSelectors) {
  //       const targetElement = event.target as HTMLElement;
  //       if (excludeSelectors.some((selector) => document.querySelector(selector) && targetElement.matches(selector))) return;
  //     }
  //     onKey(event.key, event);
  //   },
  //   [keyList, onKey, debounce, preventDefault]
  // );

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

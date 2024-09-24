import React from "react";
import useShortcut from "./use-shortcut";
import { ShortcutProps } from "../utils/types";

const Shortcut = ({ keys, onKey, children, options, global }: ShortcutProps) => {
  const handleKeyDown = useShortcut({ keys, onKey, options, global });
  return <div tabIndex={0} onKeyDown={handleKeyDown}>{children}</div>;
};

export default Shortcut;

import { ReactNode } from "react";

export type ShortcutProps = {
  keys: string | string[];
  onKey: (key: string, event: KeyboardEvent) => void;
  options?: ShortcutOptions;
  global?: boolean;
  children: ReactNode;
};

export type ShortcutOptions = {
  debounce?: number;
  excludeSelectors?: string[];
  preventDefault?: boolean;
};

export type UseShortcutProps = Omit<ShortcutProps, "children">;

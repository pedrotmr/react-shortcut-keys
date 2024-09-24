"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const debounce_fn_1 = __importDefault(require("../utils/debounce-fn"));
const useShortcut = ({ keys, onKey, options, global = false, }) => {
    const keyList = Array.isArray(keys) ? keys : [keys];
    const { debounce, excludeSelectors, preventDefault } = options ?? {};
    const handleKeyDown = (0, react_1.useCallback)((event) => {
        if (!keyList.includes(event.key))
            return;
        if (preventDefault)
            event.preventDefault();
        if (excludeSelectors) {
            const targetElement = event.target;
            if (excludeSelectors.some((selector) => targetElement.matches(selector)))
                return;
        }
        onKey(event.key, event);
    }, [keyList, onKey, debounce, preventDefault]);
    (0, react_1.useEffect)(() => {
        if (global) {
            const handler = debounce
                ? (0, debounce_fn_1.default)(handleKeyDown, debounce)
                : handleKeyDown;
            document.addEventListener("keydown", handler);
            return () => document.removeEventListener("keydown", handler);
        }
    }, [global, debounce, handleKeyDown]);
    if (global)
        return;
    return debounce ? (0, debounce_fn_1.default)(handleKeyDown, debounce) : handleKeyDown;
};
exports.default = useShortcut;

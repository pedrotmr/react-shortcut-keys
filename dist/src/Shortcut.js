"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const use_shortcut_1 = __importDefault(require("./use-shortcut"));
const Shortcut = ({ keys, onKey, children, options, global }) => {
    const handleKeyDown = (0, use_shortcut_1.default)({ keys, onKey, options, global });
    return react_1.default.createElement("div", { tabIndex: 0, onKeyDown: handleKeyDown }, children);
};
exports.default = Shortcut;

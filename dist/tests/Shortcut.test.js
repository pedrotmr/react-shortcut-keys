"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
const react_1 = require("@testing-library/react");
const react_2 = __importDefault(require("react"));
const src_1 = require("../src");
describe("Shortcut component", () => {
    const onKey = jest.fn();
    beforeEach(() => {
        onKey.mockClear();
        jest.useFakeTimers();
    });
    const renderShortcut = (props) => {
        const { getByText, getByTestId, getByPlaceholderText } = (0, react_1.render)(react_2.default.createElement(src_1.Shortcut, { ...props },
            react_2.default.createElement("div", null, "Test Component"),
            react_2.default.createElement("form", { "data-testid": "form" },
                react_2.default.createElement("input", { type: "text", placeholder: "First Name" }),
                react_2.default.createElement("textarea", { placeholder: "Your Message" }),
                react_2.default.createElement("button", null, "Click me"))));
        return { getByText, getByTestId, getByPlaceholderText };
    };
    it("calls onKey when the specified key is pressed", () => {
        const { getByText } = renderShortcut({ keys: "a", onKey });
        const divElement = getByText("Test Component");
        divElement.focus();
        react_1.fireEvent.keyDown(divElement, { key: "a" });
        expect(onKey).toHaveBeenCalledWith("a", expect.anything());
    });
    it("ensures key presses are case-sensitive", () => {
        const { getByText } = renderShortcut({ keys: "a", onKey });
        const divElement = getByText("Test Component");
        divElement.focus();
        react_1.fireEvent.keyDown(divElement, { key: "A" });
        expect(onKey).not.toHaveBeenCalled();
    });
    it("calls onKey when any key in the array is pressed", () => {
        const keys = ["a", "b", "c"];
        const { getByText } = renderShortcut({ keys, onKey });
        const divElement = getByText("Test Component");
        divElement.focus();
        keys.forEach((key) => {
            react_1.fireEvent.keyDown(divElement, { key });
            expect(onKey).toHaveBeenCalledWith(key, expect.anything());
        });
    });
    it("does not call onKey for keys not in the array", () => {
        const { getByText } = renderShortcut({ keys: ["a", "b", "c"], onKey });
        const divElement = getByText("Test Component");
        divElement.focus();
        react_1.fireEvent.keyDown(divElement, { key: "d" });
        expect(onKey).not.toHaveBeenCalledWith("d", expect.anything());
    });
    it("debounces onKey calls if debounce option is provided", () => {
        const { getByText } = renderShortcut({
            keys: "a",
            options: { debounce: 200 },
            onKey,
        });
        const divElement = getByText("Test Component");
        divElement.focus();
        react_1.fireEvent.keyDown(divElement, { key: "a" });
        react_1.fireEvent.keyDown(divElement, { key: "a" });
        react_1.fireEvent.keyDown(divElement, { key: "a" });
        jest.advanceTimersByTime(200);
        expect(onKey).toHaveBeenCalledTimes(1);
    });
    it("handles global keydown events when global option is true", () => {
        renderShortcut({ keys: "a", global: true, onKey });
        react_1.fireEvent.keyDown(document, { key: "a" });
        expect(onKey).toHaveBeenCalledWith("a", expect.anything());
    });
    test("prevents default behavior if preventDefault option is true", () => {
        const { getByTestId } = renderShortcut({
            keys: ["Enter", "a"],
            options: { preventDefault: true },
            onKey,
        });
        const formElement = getByTestId("form");
        formElement.focus();
        const event = react_1.createEvent.keyDown(formElement, { key: "Enter" });
        (0, react_1.fireEvent)(formElement, event);
        expect(event.defaultPrevented).toBe(true);
    });
    test("excludes elements matching excludeSelectors", () => {
        const { getByPlaceholderText, getByText } = renderShortcut({
            keys: "a",
            options: { excludeSelectors: ["input"] },
            onKey,
        });
        const inputElement = getByPlaceholderText("First Name");
        const textareaElement = getByPlaceholderText("Your Message");
        const buttonElement = getByText("Click me");
        react_1.fireEvent.keyDown(inputElement, { key: "a" });
        react_1.fireEvent.keyDown(textareaElement, { key: "a" });
        react_1.fireEvent.keyDown(buttonElement, { key: "a" });
        expect(onKey).toHaveBeenCalledTimes(2);
    });
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
const react_1 = require("@testing-library/react");
const react_2 = __importDefault(require("react"));
const use_shortcut_1 = __importDefault(require("../src/use-shortcut"));
describe("useShortcut hook", () => {
    const onKey = jest.fn();
    beforeEach(() => {
        onKey.mockClear();
        jest.useFakeTimers();
    });
    const renderTestComponent = (props) => {
        const TestComponent = () => {
            const handleKeyDown = (0, use_shortcut_1.default)(props);
            return (react_2.default.createElement("form", { "data-testid": "form", onKeyDown: handleKeyDown },
                react_2.default.createElement("input", { type: "text", placeholder: "First Name" }),
                react_2.default.createElement("input", { type: "text", placeholder: "Last Name" }),
                react_2.default.createElement("textarea", { placeholder: "Your Message" }),
                react_2.default.createElement("button", { type: "submit" }, "Click me")));
        };
        return (0, react_1.render)(react_2.default.createElement(TestComponent, null));
    };
    it("calls onKey when the specified key is pressed", () => {
        const { getByText } = renderTestComponent({ keys: "a", onKey });
        const buttonElement = getByText("Click me");
        buttonElement.focus();
        react_1.fireEvent.keyDown(buttonElement, { key: "a" });
        expect(onKey).toHaveBeenCalledWith("a", expect.anything());
    });
    it("ensures key presses are case-sensitive", () => {
        const { getByText } = renderTestComponent({ keys: "a", onKey });
        const buttonElement = getByText("Click me");
        buttonElement.focus();
        react_1.fireEvent.keyDown(buttonElement, { key: "A" });
        expect(onKey).not.toHaveBeenCalled();
    });
    it("calls onKey when any key in the array is pressed", () => {
        const keys = ["a", "b", "c"];
        const { getByText } = renderTestComponent({ keys, onKey });
        const buttonElement = getByText("Click me");
        buttonElement.focus();
        keys.forEach((key) => {
            react_1.fireEvent.keyDown(buttonElement, { key });
            expect(onKey).toHaveBeenCalledWith(key, expect.anything());
        });
    });
    it("does not call onKey for keys not in the array", () => {
        const { getByText } = renderTestComponent({ keys: ["a", "b", "c"], onKey });
        const buttonElement = getByText("Click me");
        buttonElement.focus();
        react_1.fireEvent.keyDown(buttonElement, { key: "d" });
        expect(onKey).not.toHaveBeenCalledWith("d", expect.anything());
    });
    it("debounces onKey calls if debounce option is provided", () => {
        const { getByText } = renderTestComponent({
            keys: ["a"],
            onKey,
            options: { debounce: 200 },
        });
        const buttonElement = getByText("Click me");
        buttonElement.focus();
        react_1.fireEvent.keyDown(buttonElement, { key: "a" });
        react_1.fireEvent.keyDown(buttonElement, { key: "a" });
        react_1.fireEvent.keyDown(buttonElement, { key: "a" });
        jest.advanceTimersByTime(200);
        expect(onKey).toHaveBeenCalledTimes(1);
    });
    it("handles global keydown events when global option is true", () => {
        renderTestComponent({ keys: ["a"], onKey, global: true });
        react_1.fireEvent.keyDown(document, { key: "a" });
        expect(onKey).toHaveBeenCalledWith("a", expect.anything());
    });
    test("prevents default behavior if preventDefault option is true", () => {
        const { getByTestId } = renderTestComponent({
            keys: ["Enter", "a"],
            onKey,
            options: { preventDefault: true },
        });
        const formElement = getByTestId("form");
        formElement.focus();
        const event = react_1.createEvent.keyDown(formElement, { key: "Enter" });
        (0, react_1.fireEvent)(formElement, event);
        expect(event.defaultPrevented).toBe(true);
    });
    test("excludes elements matching excludeSelectors", () => {
        const { getByPlaceholderText, getByText } = renderTestComponent({
            keys: ["a"],
            onKey,
            options: { excludeSelectors: ["input"] },
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

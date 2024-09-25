import "@testing-library/jest-dom";
import { createEvent, fireEvent, render } from "@testing-library/react";
import React from "react";
import useShortcut from "../src/use-shortcut";
import { UseShortcutProps } from "../utils/types";

describe("useShortcut hook", () => {
  const onKey = jest.fn();

  beforeEach(() => {
    onKey.mockClear();
    jest.useFakeTimers();
  });

  const renderTestComponent = (props: UseShortcutProps) => {
    const TestComponent = () => {
      const handleKeyDown = useShortcut(props);
      return (
        <form data-testid="form" onKeyDown={handleKeyDown}>
          <input type="text" placeholder="First Name" />
          <input type="text" placeholder="Last Name" />
          <textarea placeholder="Your Message"></textarea>
          <button type="submit">Click me</button>
        </form>
      );
    };
    return render(<TestComponent />);
  };

  it("calls onKey when the specified key is pressed", () => {
    const { getByText } = renderTestComponent({ keys: "a", onKey });
    const buttonElement = getByText("Click me");
    buttonElement.focus();
    fireEvent.keyDown(buttonElement, { key: "a" });
    expect(onKey).toHaveBeenCalledWith("a", expect.anything());
  });

  it("ensures key presses are case-sensitive", () => {
    const { getByText } = renderTestComponent({ keys: "a", onKey });
    const buttonElement = getByText("Click me");
    buttonElement.focus();
    fireEvent.keyDown(buttonElement, { key: "A" });
    expect(onKey).not.toHaveBeenCalled();
  });

  it("calls onKey when any key in the array is pressed", () => {
    const keys = ["a", "b", "c"];
    const { getByText } = renderTestComponent({ keys, onKey });
    const buttonElement = getByText("Click me");
    buttonElement.focus();
    keys.forEach((key) => {
      fireEvent.keyDown(buttonElement, { key });
      expect(onKey).toHaveBeenCalledWith(key, expect.anything());
    });
  });

  it("does not call onKey for keys not in the array", () => {
    const { getByText } = renderTestComponent({ keys: ["a", "b", "c"], onKey });
    const buttonElement = getByText("Click me");
    buttonElement.focus();
    fireEvent.keyDown(buttonElement, { key: "d" });
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
    fireEvent.keyDown(buttonElement, { key: "a" });
    fireEvent.keyDown(buttonElement, { key: "a" });
    fireEvent.keyDown(buttonElement, { key: "a" });
    jest.advanceTimersByTime(200);
    expect(onKey).toHaveBeenCalledTimes(1);
  });

  it("handles global keydown events when global option is true", () => {
    renderTestComponent({ keys: ["a"], onKey, global: true });
    fireEvent.keyDown(document, { key: "a" });
    expect(onKey).toHaveBeenCalledWith("a", expect.anything());
  });

  it("prevents default behavior if preventDefault option is true", () => {
    const { getByTestId } = renderTestComponent({
      keys: ["Enter", "a"],
      onKey,
      options: { preventDefault: true },
    });
    const formElement = getByTestId("form");
    formElement.focus();
    const event = createEvent.keyDown(formElement, { key: "Enter" });
    fireEvent(formElement, event);
    expect(event.defaultPrevented).toBe(true);
  });

  it("excludes elements matching excludeSelectors", () => {
    const { getByPlaceholderText, getByText } = renderTestComponent({
      keys: ["a"],
      onKey,
      options: { excludeSelectors: ["input"] },
    });
    const inputElement = getByPlaceholderText("First Name");
    const textareaElement = getByPlaceholderText("Your Message");
    const buttonElement = getByText("Click me");

    fireEvent.keyDown(inputElement, { key: "a" });
    fireEvent.keyDown(textareaElement, { key: "a" });
    fireEvent.keyDown(buttonElement, { key: "a" });

    expect(onKey).toHaveBeenCalledTimes(2);
  });

  it("handles cmd+k shortcut on Mac", () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      configurable: true,
    });
    const { getByText } = renderTestComponent({ keys: "cmd+k", onKey });
    const buttonElement = getByText("Click me");
    buttonElement.focus();
    fireEvent.keyDown(buttonElement, { key: "k", metaKey: true });
    expect(onKey).toHaveBeenCalledTimes(1);
  });

  it("handles ctrl+k shortcut on Windows", () => {
    Object.defineProperty(navigator, "userAgent", {
      value:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      configurable: true,
    });
    const { getByText } = renderTestComponent({ keys: "ctrl+k", onKey });
    const buttonElement = getByText("Click me");
    buttonElement.focus();
    fireEvent.keyDown(buttonElement, { key: "k", ctrlKey: true });
    expect(onKey).toHaveBeenCalledWith("ctrl+k", expect.anything());
  });
});

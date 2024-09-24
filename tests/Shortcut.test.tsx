import "@testing-library/jest-dom";
import { createEvent, fireEvent, render } from "@testing-library/react";
import React from "react";
import { Shortcut } from "../src";
import { UseShortcutProps } from "../utils/types";

describe("Shortcut component", () => {
  const onKey = jest.fn();

  beforeEach(() => {
    onKey.mockClear();
    jest.useFakeTimers();
  });

  const renderShortcut = (props: UseShortcutProps) => {
    const { getByText, getByTestId, getByPlaceholderText } = render(
      <Shortcut {...props}>
        <div>Test Component</div>
        <form data-testid="form">
          <input type="text" placeholder="First Name" />
          <textarea placeholder="Your Message"></textarea>
          <button>Click me</button>
        </form>
      </Shortcut>
    );
    return { getByText, getByTestId, getByPlaceholderText };
  };

  it("calls onKey when the specified key is pressed", () => {
    const { getByText } = renderShortcut({ keys: "a", onKey });
    const divElement = getByText("Test Component");
    divElement.focus();
    fireEvent.keyDown(divElement, { key: "a" });
    expect(onKey).toHaveBeenCalledWith("a", expect.anything());
  });

  it("ensures key presses are case-sensitive", () => {
    const { getByText } = renderShortcut({ keys: "a", onKey });
    const divElement = getByText("Test Component");
    divElement.focus();
    fireEvent.keyDown(divElement, { key: "A" });
    expect(onKey).not.toHaveBeenCalled();
  });

  it("calls onKey when any key in the array is pressed", () => {
    const keys = ["a", "b", "c"];
    const { getByText } = renderShortcut({ keys, onKey });
    const divElement = getByText("Test Component");
    divElement.focus();
    keys.forEach((key) => {
      fireEvent.keyDown(divElement, { key });
      expect(onKey).toHaveBeenCalledWith(key, expect.anything());
    });
  });

  it("does not call onKey for keys not in the array", () => {
    const { getByText } = renderShortcut({ keys: ["a", "b", "c"], onKey });
    const divElement = getByText("Test Component");
    divElement.focus();
    fireEvent.keyDown(divElement, { key: "d" });
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
    fireEvent.keyDown(divElement, { key: "a" });
    fireEvent.keyDown(divElement, { key: "a" });
    fireEvent.keyDown(divElement, { key: "a" });
    jest.advanceTimersByTime(200);
    expect(onKey).toHaveBeenCalledTimes(1);
  });

  it("handles global keydown events when global option is true", () => {
    renderShortcut({ keys: "a", global: true, onKey });
    fireEvent.keyDown(document, { key: "a" });
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
    const event = createEvent.keyDown(formElement, { key: "Enter" });
    fireEvent(formElement, event);
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

    fireEvent.keyDown(inputElement, { key: "a" });
    fireEvent.keyDown(textareaElement, { key: "a" });
    fireEvent.keyDown(buttonElement, { key: "a" });

    expect(onKey).toHaveBeenCalledTimes(2);
  });
});

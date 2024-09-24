import "@testing-library/jest-dom";
import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Shortcut, useShortcut } from "../src";
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

// 1. Text Editor Shortcuts
describe("TextEditor", () => {
  const toggleBold = jest.fn();
  const toggleItalic = jest.fn();
  const toggleUnderline = jest.fn();

  const TextEditor = () => {
    const handleShortcut = (key: string, event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (key) {
          case "b":
            toggleBold();
            break;
          case "i":
            toggleItalic();
            break;
          case "u":
            toggleUnderline();
            break;
        }
      }
    };

    const keydownHandler = useShortcut({
      keys: ["b", "i", "u"],
      onKey: handleShortcut,
      options: { preventDefault: true },
    });

    return (
      <div data-testid="editor" tabIndex={0} onKeyDown={keydownHandler}>
        Text Editor
      </div>
    );
  };

  it("handles text editor shortcuts", () => {
    render(<TextEditor />);
    const editor = screen.getByTestId("editor");

    fireEvent.keyDown(editor, { key: "b", ctrlKey: true });
    fireEvent.keyDown(editor, { key: "i", ctrlKey: true });
    fireEvent.keyDown(editor, { key: "u", ctrlKey: true });

    expect(toggleBold).toHaveBeenCalledTimes(1);
    expect(toggleItalic).toHaveBeenCalledTimes(1);
    expect(toggleUnderline).toHaveBeenCalledTimes(1);
  });
});

// 2. Modal Navigation
describe("Modal", () => {
  const submitForm = jest.fn();

  const Modal = ({ onClose }: { onClose: () => void }) => {
    const handleShortcut = (key: string) => {
      switch (key) {
        case "Escape":
          onClose();
          break;
        case "Enter":
          submitForm();
          break;
      }
    };

    return (
      <Shortcut keys={["Escape", "Enter"]} onKey={handleShortcut} global>
        <div data-testid="modal">Modal Content</div>
      </Shortcut>
    );
  };

  it("handles modal navigation shortcuts", () => {
    const onClose = jest.fn();
    render(<Modal onClose={onClose} />);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: "Enter" });
    expect(submitForm).toHaveBeenCalledTimes(1);
  });
});

// 3. Game Controls
describe("GameComponent", () => {
  const movePlayer = jest.fn();
  const playerJump = jest.fn();

  const GameComponent = () => {
    const handleMovement = (key: string) => {
      switch (key) {
        case "ArrowUp":
          movePlayer("up");
          break;
        case "ArrowDown":
          movePlayer("down");
          break;
        case "ArrowLeft":
          movePlayer("left");
          break;
        case "ArrowRight":
          movePlayer("right");
          break;
        case " ":
          playerJump();
          break;
      }
    };

    const keydownHandler = useShortcut({
      keys: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "],
      onKey: handleMovement,
      options: { preventDefault: true },
      global: true,
    });

    // React.useEffect(() => {
    //   window.addEventListener("keydown", keydownHandler);
    //   return () => window.removeEventListener("keydown", keydownHandler);
    // }, [keydownHandler]);

    return <div data-testid="game">Game Container</div>;
  };

  it("handles game control shortcuts", () => {
    render(<GameComponent />);

    fireEvent.keyDown(document, { key: "ArrowUp" });
    expect(movePlayer).toHaveBeenCalledWith("up");

    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(movePlayer).toHaveBeenCalledWith("down");

    fireEvent.keyDown(document, { key: "ArrowLeft" });
    expect(movePlayer).toHaveBeenCalledWith("left");

    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(movePlayer).toHaveBeenCalledWith("right");

    fireEvent.keyDown(document, { key: " " });
    expect(playerJump).toHaveBeenCalledTimes(1);
  });
});

// 4. Application-wide Shortcuts
describe("App", () => {
  const toggleSearchBar = jest.fn();
  const openCommandPalette = jest.fn();
  const openSettings = jest.fn();

  const App = () => {
    const handleGlobalShortcuts = (key: string, event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (key) {
          case "/":
            toggleSearchBar();
            break;
          case "k":
            openCommandPalette();
            break;
          case ",":
            openSettings();
            break;
        }
      }
    };

    return (
      <Shortcut
        keys={["/", "k", ","]}
        onKey={handleGlobalShortcuts}
        options={{ preventDefault: true }}
        global
      >
        <div data-testid="app">App Content</div>
      </Shortcut>
    );
  };

  it("handles application-wide shortcuts", () => {
    render(<App />);

    fireEvent.keyDown(document, { key: "/", ctrlKey: true });
    expect(toggleSearchBar).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(openCommandPalette).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: ",", ctrlKey: true });
    expect(openSettings).toHaveBeenCalledTimes(1);
  });
});

// 5. Accessibility Navigation
describe("AccessibleNavigation", () => {
  const navigateToSection = jest.fn();

  const AccessibleNavigation = () => {
    const handleNavigation = (key: string) => {
      switch (key) {
        case "1":
          navigateToSection("home");
          break;
        case "2":
          navigateToSection("products");
          break;
        case "3":
          navigateToSection("about");
          break;
        case "4":
          navigateToSection("contact");
          break;
      }
    };

    const keydownHandler = useShortcut({
      keys: ["1", "2", "3", "4"],
      onKey: handleNavigation,
      options: { excludeSelectors: ["input", "textarea"] },
      global: true,
    });

    return (
      <nav data-testid="nav">
        <ul>
          <li>Home (Press 1)</li>
          <li>Products (Press 2)</li>
          <li>About (Press 3)</li>
          <li>Contact (Press 4)</li>
        </ul>
      </nav>
    );
  };

  beforeEach(() => {
    navigateToSection.mockClear();
  });

  it("handles accessibility navigation shortcuts", () => {
    render(<AccessibleNavigation />);

    fireEvent.keyDown(document, { key: "1" });
    expect(navigateToSection).toHaveBeenCalledWith("home");

    fireEvent.keyDown(document, { key: "2" });
    expect(navigateToSection).toHaveBeenCalledWith("products");

    fireEvent.keyDown(document, { key: "3" });
    expect(navigateToSection).toHaveBeenCalledWith("about");

    fireEvent.keyDown(document, { key: "4" });
    expect(navigateToSection).toHaveBeenCalledWith("contact");
  });

  it("does not trigger shortcuts on excluded elements", () => {
    render(
      <>
        <AccessibleNavigation />
        <input data-testid="input" type="text" />
      </>
    );

    const input = screen.getByTestId("input");
    fireEvent.keyDown(input, { key: "1" });
    expect(navigateToSection).not.toHaveBeenCalled();
  });
});

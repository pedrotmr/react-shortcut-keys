# React Shorcut Keys

Live on npm: https://www.npmjs.com/package/react-shortcut-keys

This package provides a way to handle keyboard shortcuts in a React application. It includes a custom hook (`useShortcut`) and a component (`Shortcut`) to facilitate the handling of single-character keyboard shortcuts, with support for case sensitivity and additional customization options.

## Features

1. **Custom Hook (`useShortcut`)**:
   - Accepts keys to handle and a handler to invoke.
   - Returns a callback that can be attached to an element’s `onKeyDown` event.
   - Supports options for debouncing, excluding specific DOM selectors, and preventing default behavior.
   - Can handle global shortcuts on the document.

2. **Component (`Shortcut`)**:
   - Wraps another element and applies the given shortcut handling to that element.
   - Supports the same options as the hook.

## Installation

To install the package, run:

```bash
npm install react-shortcut-handler
```

## Usage

### Using the `useShortcut` Hook

```tsx
import { useCallback } from "react";
import { useShortcut } from "react-shortcut-handler";

const MyComponent = () => {
  const onKey = useCallback((key, event) => {
    alert(`Handled ${key}!`);
  }, []);

  const handleKeyDown = useShortcut({ keys: "x", onKey });

  return (
    <button onKeyDown={handleKeyDown}>
      This button has keyboard shortcuts enabled!
    </button>
  );
};
```

### Using the `Shortcut` Component

```tsx
import { Shortcut } from "react-shortcut-handler";

const MyComponent = () => {
  const keys = "x";
  const onKey = useCallback((key, event) => {
    alert(`Handled ${key}!`);
  }, []);

  return (
    <Shortcut keys={keys} onKey={onKey}>
      <input type="text" placeholder="First Name" />
      <button>This button has keyboard shortcuts enabled!</button>
    </Shortcut>
  );
};
```

## Options

Both the hook and the component support the following options:

- `keys`: A string or an array of strings representing the keys to handle.
- `onKey`: A callback function to invoke when the specified key is pressed.
- `options` (optional):
  - `debounce`: Number of milliseconds to debounce the key events.
  - `preventDefault`: Boolean indicating whether to prevent the default action of the key event.
  - `excludeSelectors`: Array of HTML tags to exclude from the key handling.
- `global` (optional): Boolean indicating whether the key handling should be global.

## Real Use Cases

### Text Editor Shortcuts

```tsx
import { useCallback } from "react";
import { useShortcut } from "react-shortcut-handler";

const TextEditor = () => {
  const toggleBold = useCallback(() => {
    console.log("Bold toggled");
  }, []);

  const toggleItalic = useCallback(() => {
    console.log("Italic toggled");
  }, []);

  const toggleUnderline = useCallback(() => {
    console.log("Underline toggled");
  }, []);

  const handleShortcut = useCallback((key, event) => {
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
  }, [toggleBold, toggleItalic, toggleUnderline]);

  const keydownHandler = useShortcut({
    keys: ["b", "i", "u"],
    onKey: handleShortcut,
    options: { preventDefault: true },
  });

  return (
    <div tabIndex={0} onKeyDown={keydownHandler}>
      Text Editor
    </div>
  );
};
```

### Modal Navigation

```tsx
import { useCallback } from "react";
import { Shortcut } from "react-shortcut-handler";

const Modal = ({ onClose }) => {
  const submitForm = useCallback(() => {
    console.log("Form submitted");
  }, []);

  const handleShortcut = useCallback((key) => {
    switch (key) {
      case "Escape":
        onClose();
        break;
      case "Enter":
        submitForm();
        break;
    }
  }, [onClose, submitForm]);

  return (
    <Shortcut keys={["Escape", "Enter"]} onKey={handleShortcut} global>
      <div>Modal Content</div>
    </Shortcut>
  );
};
```

### Game Controls

```tsx
import { useCallback } from "react";
import { useShortcut } from "react-shortcut-handler";

const GameComponent = () => {
  const movePlayer = useCallback((direction) => {
    console.log(`Player moved ${direction}`);
  }, []);

  const playerJump = useCallback(() => {
    console.log("Player jumped");
  }, []);

  const handleMovement = useCallback((key) => {
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
  }, [movePlayer, playerJump]);

  const keydownHandler = useShortcut({
    keys: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "],
    onKey: handleMovement,
    options: { preventDefault: true },
    global: true,
  });

  return <div tabIndex={0} onKeyDown={keydownHandler}>Game Container</div>;
};
```

### Application-wide Shortcuts

```tsx
import { useCallback } from "react";
import { Shortcut } from "react-shortcut-handler";

const App = () => {
  const toggleSearchBar = useCallback(() => {
    console.log("Search bar toggled");
  }, []);

  const openCommandPalette = useCallback(() => {
    console.log("Command palette opened");
  }, []);

  const openSettings = useCallback(() => {
    console.log("Settings opened");
  }, []);

  const handleGlobalShortcuts = useCallback((key, event) => {
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
  }, [toggleSearchBar, openCommandPalette, openSettings]);

  return (
    <Shortcut
      keys={["/", "k", ","]}
      onKey={handleGlobalShortcuts}
      options={{ preventDefault: true }}
      global
    >
      <div>App Content</div>
    </Shortcut>
  );
};
```

### Accessibility Navigation

```tsx
import { useCallback } from "react";
import { useShortcut } from "react-shortcut-handler";

const AccessibleNavigation = () => {
  const navigateToSection = useCallback((section) => {
    console.log(`Navigated to ${section}`);
  }, []);

  const handleNavigation = useCallback((key) => {
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
  }, [navigateToSection]);

  const keydownHandler = useShortcut({
    keys: ["1", "2", "3", "4"],
    onKey: handleNavigation,
    options: { excludeSelectors: ["input", "textarea"] },
    global: true,
  });

  return (
    <nav tabIndex={0} onKeyDown={keydownHandler}>
      <ul>
        <li>Home (Press 1)</li>
        <li>Products (Press 2)</li>
        <li>About (Press 3)</li>
        <li>Contact (Press 4)</li>
      </ul>
    </nav>
  );
};
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License.

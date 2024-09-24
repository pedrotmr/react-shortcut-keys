# React Keyboard Shortcuts Package

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

## Running Locally

To run this package locally, follow these steps:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run tests**:

   ```bash
   npm test
   ```

3. **Build the package**:

   ```bash
   npm run build
   ```

5. **Link the package**:

   ```bash
   npm link
   ```

6. **Use the package in another project**:

   - Navigate to your other project directory.
   - Run:
     ```bash
     npm link your-package-name
     ```

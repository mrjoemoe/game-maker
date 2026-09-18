## Why

Charting still requires the pointer for every move, and map seeds are buried in state. Keyboard shortcuts plus a copyable seed/inspector make it faster to iterate on layouts.

## What Changes

- Arrow keys append matching move actions; Escape clears the chart; D toggles debug; Enter runs when allowed
- Debug panel copies the current map seed and the inspector line
- Toolbar shows the wall seed so designers can note a layout

## Impact

- Capability: `playtest-web-app`
- Engine: reused
- Components: none

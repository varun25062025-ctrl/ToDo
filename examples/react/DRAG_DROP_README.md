# Drag-and-Drop Reordering Feature

## Overview
This document describes the implementation of drag-and-drop reordering functionality for the React TodoMVC application.

## Features Implemented

### 1. Core Functionality
- **Drag Handle**: Each todo item has a drag handle (☰) on the left side
- **Drag-and-Drop**: Users can reorder items by dragging the handle
- **Filter-Safe Reordering**: Reordering works correctly in All/Active/Completed views
- **Persistence**: Order is preserved in localStorage across page reloads
- **Accessibility**: Keyboard support via dnd-kit's keyboard sensors

### 2. User Experience
- **Visual Feedback**: Items become semi-transparent (50% opacity) while dragging
- **Edit Mode Protection**: Drag handle is disabled when editing a todo item
- **Touch Support**: Works on touch devices via dnd-kit's touch sensors
- **Smooth Animations**: CSS transitions for smooth drag animations

### 3. Technical Implementation

#### Files Modified

1. **constants.js**
   - Added `REORDER_TODOS` action constant

2. **reducer.js**
   - Added `migrateTodos()` function for backwards compatibility
   - Added `normalizeOrders()` helper to maintain clean order values
   - Added `filterTodosByRoute()` helper for filter-aware operations
   - Added `reorderFilterSafe()` function for filter-aware reordering
   - Updated `ADD_ITEM` to assign order values
   - Updated `REMOVE_ITEM` and `REMOVE_COMPLETED_ITEMS` to normalize orders
   - Added `REORDER_TODOS` action handler

3. **app.jsx**
   - Added localStorage persistence with `STORAGE_KEY = "todos"`
   - Added initialization logic with migration support
   - Added `useEffect` to persist todos on every change

4. **main.jsx**
   - Integrated `@dnd-kit` components: `DndContext`, `SortableContext`
   - Added sensors for pointer and keyboard interactions
   - Added sorting logic (sort by order, then filter)
   - Added `handleDragEnd` to dispatch `REORDER_TODOS` action

5. **item.jsx**
   - Integrated `useSortable` hook from `@dnd-kit`
   - Added drag handle button with proper ARIA attributes
   - Added logic to disable dragging during edit mode
   - Added visual feedback styles (opacity, transform)

6. **app.css**
   - Added drag handle styles (cursor, touch-action)
   - Added dragging state styles (opacity)
   - Added flexbox layout for proper handle positioning

#### Dependencies Added
- `@dnd-kit/core` - Core drag-and-drop functionality
- `@dnd-kit/sortable` - Sortable list primitives
- `@dnd-kit/utilities` - Utility functions for transforms

### 4. Filter-Safe Reordering Logic

The reordering algorithm ensures that:
- When in **All** view: All items can be reordered
- When in **Active** view: Only active (incomplete) items are reordered; completed items maintain their relative positions
- When in **Completed** view: Only completed items are reordered; active items maintain their relative positions

**Algorithm:**
1. Filter todos by current route to get visible items
2. Find old and new indices within the visible list
3. Reorder the visible item IDs using array splice
4. Create a new order map for visible items
5. Update order for visible items, keep non-visible unchanged
6. Normalize all orders to 0..N-1 to avoid gaps

### 5. Data Migration

The `migrateTodos()` function handles backwards compatibility:
- Checks if todos have the `order` field
- Assigns `order = index` for todos without the field
- Preserves existing order values
- Handles edge cases (null, undefined, empty array)

### 6. Testing

#### Unit Tests (reducer.test.js)
- ✓ ADD_ITEM assigns correct order values
- ✓ REMOVE_ITEM normalizes orders after deletion
- ✓ REMOVE_COMPLETED_ITEMS normalizes orders
- ✓ REORDER_TODOS works in All view
- ✓ REORDER_TODOS is filter-safe in Active view
- ✓ REORDER_TODOS is filter-safe in Completed view
- ✓ migrateTodos adds order to old todos
- ✓ migrateTodos preserves existing order
- ✓ migrateTodos handles edge cases

Run tests: `npm test`

### 7. Accessibility Features

- **ARIA Labels**: Drag handle has descriptive `aria-label` (e.g., "Drag to reorder Buy milk")
- **ARIA Disabled**: Handle shows `aria-disabled="true"` during edit mode
- **Keyboard Support**: Uses dnd-kit's keyboard sensors with arrow key navigation
- **Focus Management**: Handle is keyboard focusable (tabIndex={0}) when enabled
- **Visual Indicators**: Disabled state has reduced opacity and "not-allowed" cursor

### 8. Browser Compatibility

- Modern browsers with ES6+ support
- Touch devices (iOS, Android)
- Keyboard navigation
- Screen reader compatible

### 9. Future Enhancements

Potential improvements:
- Server-side persistence instead of localStorage
- Undo/redo functionality
- Bulk reordering operations
- Custom drag preview/ghost element
- Haptic feedback on mobile devices
- Animation customization options

### 10. Known Limitations

- localStorage has size limits (~5-10MB depending on browser)
- No conflict resolution for multi-device scenarios
- No real-time sync between browser tabs

## Usage

1. **Reorder Items**: Click and drag the handle (☰) to move items
2. **Keyboard Reorder**: Focus the handle and use arrow keys
3. **Filter and Reorder**: Switch to Active/Completed views and reorder within that filter
4. **Persistence**: Order is automatically saved and restored on page reload

## Architecture Decisions

1. **Library Choice**: `@dnd-kit` was chosen for its:
   - Excellent accessibility support
   - Built-in keyboard and touch handling
   - Modular architecture
   - Active maintenance and community

2. **Order Field**: Added explicit `order` property instead of relying on array indices to:
   - Persist order independently of in-memory state
   - Support efficient reordering operations
   - Enable future server-side persistence

3. **Normalization**: Orders are normalized to 0..N-1 after deletions to:
   - Prevent order value drift over time
   - Avoid duplicate order values
   - Maintain consistent and predictable state

4. **localStorage**: Chosen for persistence because:
   - Simple implementation for client-side demo
   - No backend required
   - Sufficient for TodoMVC scope
   - Easy to migrate to server-side later

## References

- [Enhancement Requirement](https://epam-team-ygykgdb3j.atlassian.net/wiki/spaces/~5b48f7dd7975a22beeaeb712/pages/9732117)
- [Architecture Document](https://epam-team-ygkgdb3j.atlassian.net/wiki/spaces/~5b48f7dd7975a22beeaeb712/pages/9764884)
- [Low Level Design](https://epam-team-ygkgdb3j.atlassian.net/wiki/spaces/~5b48f7dd7975a22beeaeb712/pages/10190849)
- [dnd-kit Documentation](https://docs.dndkit.com/)

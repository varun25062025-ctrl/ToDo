# Manual Testing Checklist for TodoMVC Drag-and-Drop

## Test Environment
- **Application URL**: http://localhost:8081/
- **Browser**: Chrome
- **Date**: 2026-05-06

## Basic Functionality

### 1. Drag Handle Display
- [ ] Drag handles (::) are visible for each todo item
- [ ] Drag handles appear before the checkbox
- [ ] Drag handles have proper styling (gray color, bold)
- [ ] Drag handles show hover effect (darker color)

### 2. Basic Drag Operations
- [ ] Can drag a todo from position 1 to position 3
- [ ] Can drag a todo from position 3 to position 1
- [ ] Can drag a todo from middle position to top
- [ ] Can drag a todo from middle position to bottom
- [ ] Items reorder correctly and smoothly

### 3. Visual Feedback
- [ ] Dragged item shows reduced opacity (0.4)
- [ ] Dragged item shows background color change
- [ ] Other items move smoothly to make space
- [ ] Transitions are smooth (no jank)
- [ ] No visual glitches during drag

### 4. Persistence
- [ ] Order persists after page refresh (F5)
- [ ] Order persists after browser close/reopen
- [ ] localStorage contains todos with order property
- [ ] localStorage key is "todos-react-dndkit"

## Filter Testing

### 5. Active Filter View
- [ ] Can drag items in Active filter
- [ ] Completed items are not visible during drag
- [ ] Order maintains correctly when switching back to All
- [ ] Drag only affects visible (active) items

### 6. Completed Filter View
- [ ] Can drag items in Completed filter
- [ ] Active items are not visible during drag
- [ ] Order maintains correctly when switching back to All
- [ ] Drag only affects visible (completed) items

### 7. All Filter View
- [ ] Can drag any item (active or completed)
- [ ] Completed status is maintained during drag
- [ ] Mix of active and completed items reorder correctly

## Edit Mode Protection

### 8. Edit Mode Interaction
- [ ] Double-click a todo to enter edit mode
- [ ] Drag handle disappears during edit
- [ ] Cannot drag while in edit mode
- [ ] Drag handle reappears after exiting edit (press Enter)
- [ ] Drag handle reappears after exiting edit (blur/click outside)
- [ ] Cancel edit (Esc) restores drag handle

## Accessibility

### 9. Keyboard Navigation
- [ ] Can Tab to drag handle
- [ ] Drag handle shows focus indicator (outline)
- [ ] Press Space to grab item (if keyboard sensor active)
- [ ] Arrow keys move item (if keyboard sensor active)
- [ ] Press Space to drop item (if keyboard sensor active)
- [ ] Screen reader reads ARIA labels correctly

### 10. ARIA Attributes
- [ ] Drag handle has role="button"
- [ ] Drag handle has aria-label with item title
- [ ] Drag handle has tabIndex="0"
- [ ] ARIA labels are descriptive and helpful

## Edge Cases

### 11. Single Item
- [ ] Drag handle visible with only 1 item
- [ ] No error when attempting to drag (stays in place)
- [ ] App remains stable

### 12. Empty List
- [ ] No errors with empty todo list
- [ ] Add new item works correctly
- [ ] First item gets order property

### 13. Many Items (Performance)
- [ ] Create 15+ items
- [ ] Drag operation remains smooth
- [ ] No noticeable lag or delay
- [ ] Scrolling works if list is long
- [ ] Memory usage is reasonable

### 14. Rapid Operations
- [ ] Multiple quick drag operations work
- [ ] No race conditions or conflicts
- [ ] Order values remain unique and correct
- [ ] No item duplication or loss

## CRUD Operations During Drag

### 15. Add Item
- [ ] New item added at end with correct order
- [ ] Can immediately drag new item
- [ ] Order values update correctly

### 16. Delete Item
- [ ] Can delete item using X button
- [ ] Order values remain correct after delete
- [ ] No gaps in order sequence

### 17. Toggle Completion
- [ ] Can toggle completion status
- [ ] Completed item can still be dragged
- [ ] Strikethrough style maintained during drag

### 18. Toggle All
- [ ] Toggle All checkbox works
- [ ] All items can be dragged after toggle
- [ ] Order maintained after toggle

## Console and Network

### 19. Console Errors
- [ ] No JavaScript errors during drag
- [ ] No React warnings in console
- [ ] No CORS or network errors
- [ ] No 404 errors for assets

### 20. localStorage Operations
- [ ] localStorage updates after each drag
- [ ] localStorage contains valid JSON
- [ ] Order property is a number
- [ ] All todos have order property

### 21. Performance
- [ ] No memory leaks during repeated drags
- [ ] Browser remains responsive
- [ ] CPU usage is reasonable
- [ ] No excessive re-renders

## Cross-Browser Compatibility

### 22. Browser Support
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Edge
- [ ] Works in Safari (if available)

## Mobile/Touch Support

### 23. Touch Devices
- [ ] Touch drag works on mobile (if applicable)
- [ ] Touch feedback is appropriate
- [ ] No accidental drags

## Test Results Summary

**Total Tests**: 23 categories
**Passed**: ___
**Failed**: ___
**Blocked**: ___
**Notes**: ___

## Issues Found

1. 
2. 
3. 

## Recommendations

1. 
2. 
3.

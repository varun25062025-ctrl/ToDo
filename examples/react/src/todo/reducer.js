import { ADD_ITEM, UPDATE_ITEM, REMOVE_ITEM, TOGGLE_ITEM, REMOVE_ALL_ITEMS, TOGGLE_ALL, REMOVE_COMPLETED_ITEMS, REORDER_TODOS } from "./constants";

/* Borrowed from https://github.com/ai/nanoid/blob/3.0.2/non-secure/index.js

The MIT License (MIT)

Copyright 2017 Andrey Sitnik <andrey@sitnik.ru>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

// This alphabet uses `A-Za-z0-9_-` symbols.
// The order of characters is optimized for better gzip and brotli compression.
// References to the same file (works both for gzip and brotli):
// `'use`, `andom`, and `rict'`
// References to the brotli default dictionary:
// `-26T`, `1983`, `40px`, `75px`, `bush`, `jack`, `mind`, `very`, and `wolf`
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

function nanoid(size = 21) {
    let id = "";
    // A compact alternative for `for (var i = 0; i < step; i++)`.
    let i = size;
    while (i--) {
        // `| 0` is more compact and faster than `Math.floor()`.
        id += urlAlphabet[(Math.random() * 64) | 0];
    }
    return id;
}

/**
 * Helper function to normalize order values to 0..N-1
 */
function normalizeOrders(todos) {
    return todos.map((todo, index) => ({ ...todo, order: index }));
}

/**
 * Helper function to filter todos based on route
 */
function filterTodosByRoute(todos, route) {
    if (route === "/active") return todos.filter(t => !t.completed);
    if (route === "/completed") return todos.filter(t => t.completed);
    return todos;
}

/**
 * Helper function to reorder within filtered view (filter-safe)
 * This ensures that only visible items are reordered while maintaining
 * the relative order of non-visible items
 */
function reorderFilterSafe(todos, activeId, overId, currentRoute) {
    // Get all visible todos in their current order
    const visible = filterTodosByRoute(todos, currentRoute);
    const visibleIds = visible.map(t => t.id);
    
    // Find indices in the visible list
    const oldIndex = visibleIds.indexOf(activeId);
    const newIndex = visibleIds.indexOf(overId);
    
    if (oldIndex === -1 || newIndex === -1) return todos;
    
    // Reorder the visible IDs array
    const reorderedVisibleIds = [...visibleIds];
    const [removed] = reorderedVisibleIds.splice(oldIndex, 1);
    reorderedVisibleIds.splice(newIndex, 0, removed);
    
    // Create a map of id -> new order for visible items
    const newOrderMap = new Map();
    reorderedVisibleIds.forEach((id, index) => {
        newOrderMap.set(id, index);
    });
    
    // Build the result: update order for visible items, keep non-visible unchanged
    let result = todos.map(todo => {
        if (newOrderMap.has(todo.id)) {
            // This is a visible item - update its order based on new position
            return { ...todo, order: newOrderMap.get(todo.id) };
        }
        // Non-visible item - keep existing order
        return todo;
    });
    
    // Normalize all orders to avoid gaps
    result = normalizeOrders(result.sort((a, b) => a.order - b.order));
    
    return result;
}

/**
 * Migrate old todos without order field
 */
export function migrateTodos(todos) {
    if (!todos || !Array.isArray(todos)) return [];
    return todos.map((todo, index) => ({
        ...todo,
        order: todo.order !== undefined ? todo.order : index
    }));
}

export const todoReducer = (state, action) => {
    let nextState;
    
    switch (action.type) {
        case ADD_ITEM:
            // New items get the highest order (appended at end)
            const maxOrder = state.length > 0 ? Math.max(...state.map(t => t.order || 0)) : -1;
            nextState = state.concat({ 
                id: nanoid(), 
                title: action.payload.title, 
                completed: false,
                order: maxOrder + 1
            });
            return nextState;
            
        case UPDATE_ITEM:
            return state.map((todo) => 
                todo.id === action.payload.id 
                    ? { ...todo, title: action.payload.title } 
                    : todo
            );
            
        case REMOVE_ITEM:
            nextState = state.filter((todo) => todo.id !== action.payload.id);
            // Normalize orders after deletion
            return normalizeOrders(nextState);
            
        case TOGGLE_ITEM:
            return state.map((todo) => 
                todo.id === action.payload.id 
                    ? { ...todo, completed: !todo.completed } 
                    : todo
            );
            
        case REMOVE_ALL_ITEMS:
            return [];
            
        case TOGGLE_ALL:
            return state.map((todo) => 
                todo.completed !== action.payload.completed 
                    ? { ...todo, completed: action.payload.completed } 
                    : todo
            );
            
        case REMOVE_COMPLETED_ITEMS:
            nextState = state.filter((todo) => !todo.completed);
            // Normalize orders after deletion
            return normalizeOrders(nextState);
            
        case REORDER_TODOS:
            return reorderFilterSafe(
                state,
                action.payload.activeId,
                action.payload.overId,
                action.payload.filter
            );
    }

    throw Error(`Unknown action: ${action.type}`);
};

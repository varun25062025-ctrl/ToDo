// This file contains the drag and drop implementation patches

// Updated template.js content
const templateUpdates = {
  dragHandle: '<span class="drag-handle">⋮⋮</span>',
  orderAttribute: 'data-order="${order}"',
  draggableAttribute: 'draggable="true"'
};

// Updated CSS for drag and drop
const dragDropCSS = `
/* Drag handle styles */
.drag-handle {
    cursor: move;
    padding: 0 10px;
    color: #ccc;
    font-size: 18px;
    line-height: 1;
    display: inline-block;
    user-select: none;
}

.drag-handle:hover {
    color: #777;
}

/* Dragging state styles */
li.dragging {
    opacity: 0.4;
    background: #f5f5f5;
}

li.drag-over {
    border-top: 2px solid #4d4d4d;
}

/* Transition for smooth reordering */
.todo-list li {
    transition: transform 0.2s ease;
}
`;

console.log('Drag and drop configuration ready');

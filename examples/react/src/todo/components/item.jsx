import { memo, useState, useCallback } from "react";
import classnames from "classnames";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

export const Item = memo(function Item({ todo, dispatch, index }) {
    const [isWritable, setIsWritable] = useState(false);
    const { title, completed, id } = todo;

    const toggleItem = useCallback(() => dispatch({ type: TOGGLE_ITEM, payload: { id } }), [dispatch, id]);
    const removeItem = useCallback(() => dispatch({ type: REMOVE_ITEM, payload: { id } }), [dispatch, id]);
    const updateItem = useCallback((title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }), [dispatch, id]);

    const handleDoubleClick = useCallback(() => {
        setIsWritable(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsWritable(false);
    }, []);

    const handleUpdate = useCallback(
        (title) => {
            if (title.length === 0)
                removeItem();
            else
                updateItem(title);

            setIsWritable(false);
        },
        [removeItem, updateItem]
    );

    // Sortable hook
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ 
        id: String(id), // Ensure ID is a string
        disabled: isWritable // Disable dragging while editing
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Conditionally apply listeners only when not editing
    const dragHandleProps = isWritable ? {} : { ...listeners, ...attributes };

    return (
        <li 
            ref={setNodeRef}
            style={style}
            className={classnames({ 
                completed: todo.completed,
                dragging: isDragging 
            })} 
            data-testid="todo-item"
        >
            <div className="view">
                {/* Drag handle - only active when not editing */}
                <button
                    type="button"
                    className="drag-handle"
                    {...dragHandleProps}
                    disabled={isWritable}
                    aria-label={`Drag to reorder ${title}`}
                    tabIndex={isWritable ? -1 : 0}
                    style={{
                        cursor: isWritable ? 'not-allowed' : 'grab',
                        opacity: isWritable ? 0.3 : 1,
                        border: 'none',
                        background: 'transparent',
                        padding: '0 10px',
                        fontSize: '18px',
                        color: '#737373',
                        touchAction: 'none',
                        userSelect: 'none'
                    }}
                >
                    ☰
                </button>
                
                {isWritable ? (
                    <Input 
                        onSubmit={handleUpdate} 
                        label="Edit Todo Input" 
                        defaultValue={title} 
                        onBlur={handleBlur} 
                    />
                ) : (
                    <>
                        <input 
                            className="toggle" 
                            type="checkbox" 
                            data-testid="todo-item-toggle" 
                            checked={completed} 
                            onChange={toggleItem} 
                        />
                        <label 
                            data-testid="todo-item-label" 
                            onDoubleClick={handleDoubleClick}
                        >
                            {title}
                        </label>
                        <button 
                            type="button"
                            className="destroy" 
                            data-testid="todo-item-button" 
                            onClick={removeItem} 
                        />
                    </>
                )}
            </div>
        </li>
    );
});

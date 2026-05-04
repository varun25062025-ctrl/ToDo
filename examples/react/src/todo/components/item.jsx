import { memo, useState, useCallback } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM, REORDER_ITEMS } from "../constants";

export const Item = memo(function Item({ todo, dispatch, draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging, isDragOver, index, visibleIds }) {
    const [isWritable, setIsWritable] = useState(false);
    const { title, completed, id } = todo;

    const toggleItem = useCallback(() => dispatch({ type: TOGGLE_ITEM, payload: { id } }), [dispatch]);
    const removeItem = useCallback(() => dispatch({ type: REMOVE_ITEM, payload: { id } }), [dispatch]);
    const updateItem = useCallback((id, title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }), [dispatch]);

    const handleDoubleClick = useCallback(() => {
        setIsWritable(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsWritable(false);
    }, []);

    const handleUpdate = useCallback(
        (title) => {
            if (title.length === 0)
                removeItem(id);
            else
                updateItem(id, title);

            setIsWritable(false);
        },
        [id, removeItem, updateItem]
    );

    const canDrag = draggable && !isWritable;

    return (
        <li className={classnames({ completed: todo.completed, dragging: isDragging, \"drag-over\": isDragOver })} data-testid="todo-item" >
            <div className=\"view\">
                {isWritable ? (
                    <Input onSubmit={handleUpdate} label=\"Edit Todo Input\" defaultValue={title} onBlur={handleBlur} />
                ) : (
                    <>
                      <button
                          type=\"button\"
                          className=\"drag-handle\"
                            aria-label=\"Drag to reorder\"
                          disabled={!canDrag}
                            data-testid=\"todo-item-drag-handle\"
                            draggable={canDrag}
                            onDragStart={canDrag ? onDragStart : undefined}
                          onDragOver={canDrag ? onDragOver : undefined}
                          onDrop={canDrag ? onDrop : undefined}
                          onDragEnd={canDrag ? onDragEnd : undefined}
                          />
                      <input className=\"toggle\" type=\"checkbox\" data-testid=\"todo-item-toggle\" checked={completed} onChange={toggleItem} />
                      <label data-testid=\"todo-item-label\" onDoubleClick={handleDoubleClick}>
                          {title}
                      </label>
                        <button className=\"destroy\" data-testid=\"todo-item-button\" onClick={removeItem} />
                    </>
                 )}
            </div>
        </li>
    );
});

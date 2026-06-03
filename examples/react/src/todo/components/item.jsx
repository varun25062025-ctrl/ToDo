import { memo, useState, useCallback } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM, REORDER_ITEM } from "../constants";

export const Item = memo(function Item({ todo, dispatch, index }) {
    const [isWritable, setIsWritable] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const { title, completed, id } = todo;

    const toggleItem = useCallback(() => dispatch({ type: TOGGLE_ITEM, payload: { id } }), [dispatch, id]);
    const removeItem = useCallback(() => dispatch({ type: REMOVE_ITEM, payload: { id } }), [dispatch, id]);
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

    const handleDragStart = useCallback((e) => {
        if (isWritable) return;
        setIsDragging(true);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.currentTarget);
        e.dataTransfer.setData("index", index);
    }, [index, isWritable]);

    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        if (isWritable) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }, [isWritable]);

    const handleDrop = useCallback((e) => {
        if (isWritable) return;
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData("index"), 10);
        const toIndex = index;
        if (fromIndex !== toIndex) {
            dispatch({ type: REORDER_ITEM, payload: { fromIndex, toIndex } });
        }
    }, [index, dispatch, isWritable]);

    return (
        <li
            className={classnames({ completed: todo.completed, dragging: isDragging })}
            data-testid="todo-item"
            draggable={!isWritable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="view">
                {isWritable ? (
                    <Input onSubmit={handleUpdate} label="Edit Todo Input" defaultValue={title} onBlur={handleBlur} />
                ) : (
                    <>
                        <input className="toggle" type="checkbox" data-testid="todo-item-toggle" checked={completed} onChange={toggleItem} />
                        <label data-testid="todo-item-label" onDoubleClick={handleDoubleClick}>
                            {title}
                        </label>
                        <button className="destroy" data-testid="todo-item-button" onClick={removeItem} />
                    </>
                )}
            </div>
        </li>
    );
});

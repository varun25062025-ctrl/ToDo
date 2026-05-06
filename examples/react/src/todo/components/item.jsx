import { memo, useState, useCallback } from "react";
import classnames from "classnames";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

export const Item = memo(function Item({ todo, dispatch, index }) {
    const [isWritable, setIsWritable] = useState(false);
    const { title, completed, id } = todo;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: todo.id,
        disabled: isWritable
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

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

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={classnames({ completed: todo.completed, dragging: isDragging })}
            data-testid="todo-item"
        >
            <div className="view">
                {isWritable ? (
                    <Input onSubmit={handleUpdate} label="Edit Todo Input" defaultValue={title} onBlur={handleBlur} />
                ) : (
                    <>
                        <span
                            className="drag-handle"
                            {...attributes}
                            {...listeners}
                            role="button"
                            aria-label={`Drag to reorder ${title}`}
                            tabIndex={0}
                        >
                            ::
                        </span>
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

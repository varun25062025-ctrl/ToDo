import { useMemo, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";

import { Item } from "./item";
import classnames from "classnames";

import { TOGGLE_ALL, REORDER_ITEMS } from "../constants";

export function Main({ todos, dispatch }) {
    const { pathname: route } = useLocation();
    const [draggedId, setDraggedId] = useState(null);
    const [dropTargetId, setDropTargetId] = useState(null);

    const visibleTodos = useMemo(
        () =>
            todos.filter((todo) => {
                if (route === "/active")
                    return !todo.completed;

                if (route === "/completed")
                    return todo.completed;

                return todo;
            }),
        [todos, route]
    );

    const toggleAll = useCallback((e) => dispatch({ type: TOGGLE_ALL, payload: { completed: e.target.checked } }), [dispatch]);

    const handleDragStart = useCallback((id) => {
        setDraggedId(id);
    }, []);

    const handleDragOver = useCallback((event, id) => {
        event.preventDefault();
        setDropTargetId(id);
    }, []);

    const handleDrop = useCallback((id) => {
        if (draggedId && id) {
            const visibleIds = visibleTodos.map((todo) => todo.id);
            dispatch({
                type: REORDER_ITEMS,
                payload: { visibleIds, draggedId, targetId: id }
            });
        }
        setDraggedId(null);
        setDropTargetId(null);
    }, [draggedId, visibleTodos, dispatch]);

    const handleDragEnd = useCallback(() => {
        setDraggedId(null);
        setDropTargetId(null);
    }, []);

    return (
        <main className="main" data-testid="main">
            {visibleTodos.length > 0 ? (
                <div className="toggle-all-container">
                    <input className="toggle-all" type="checkbox" id="toggle-all" data-testid="toggle-all" checked={visibleTodos.every((todo) => todo.completed)} onChange={toggleAll} />
                    <label className="toggle-all-label" htmlFor="toggle-all">
                        Toggle All Input
                    </label>
                </div>
            ) : null}
            <ul className={classnames("todo-list")} data-testid="todo-list">
                {visibleTodos.map((todo, index) => (
                    <Item
                        todo={todo}
                        key={todo.id}
                        dispatch={dispatch}
                        index={index}
                        isDragging={todo.id === draggedId}
                        isDropTarget={todo.id === dropTargetId}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                    />
                ))}
            </ul>
        </main>
    );
}

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
    const handleDragStart = useCallback((todoId) => setDraggedId(todoId), []);
    const handleDragOver = useCallback((event, todoId) => {
        event.preventDefault();
        if (todoId !== draggedId)
            setDropTargetId(todoId);
    }, [draggedId]);
    const handleDrop = useCallback((todoId) => {
        if (draggedId && todoId && draggedId !== todoId) {
            dispatch({
                type: REORDER_ITEMS,
                payload: { draggedId, targetId: todoId, visibleIds: visibleTodos.map((todo) => todo.id) },
            });
        }
        setDraggedId(null);
        setDropTargetId(null);
    }, [dispatch, draggedId, visibleTodos]);
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
                        isDragging={draggedId === todo.id}
                        isDropTarget={dropTargetId === todo.id}
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

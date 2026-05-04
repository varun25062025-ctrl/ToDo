import { useMemo, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";

import { Item } from "./item";
import classnames from "classnames";

import { TOGGLE_ALL, REORDER_ITEMS } from "../constants";

function reorderVisibleIds(todos, route) {
    return todos.filter((todo) => {
        if (route === "/active") return !todo.completed;
        if (route === "/completed") return todo.completed;
        return todo;
    }).map((t) => t.id);
}

export function Main({ todos, dispatch }) {
    const { pathname: route } = useLocation();
    const [dragIndex, setDragIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const visibleTodos = useMemo(
        () =>
            todos.filter(((todo) => {
                if (route === "/active") return !todo.completed;

                if (route === "/completed") return todo.completed;

                return todo;
            })),
        [todos, route]
    );

    const visibleIds = useMemo(() => reorderVisibleIds(todos, route), [todos, route]);

    const toggleAll = useCallback((e) => dispatch({ type: TOGGLE_ALL, payload: { completed: e.target.checked } }), [dispatch]);

    const onDragStart = useCallback((index) => {
        setDragIndex(index);
        setDragOverIndex(index);
    }, []);

    const onDragOver = useCallback((index, e) => {
        // required to allow drop
        e.preventDefault();
        if (dragIndex == null) return;
        setDragOverIndex(index);
    }, [dragIndex]);

    const onDrop = useCallback(
        (index, e) => {
            e.preventDefault();
            if (dragIndex == null) return;
            if (dragIndex === index) return;

            dispatch({ type: REORDER_ITEMS, payload: { visibleIds, sourceIndex: dragIndex, destIndex: index } });
            setDragIndex(null);
            setDragOverIndex(null);
        },
        [dispatch, dragIndex, visibleIds]
    );

    const onDragEnd = useCallback(() => {
        setDragIndex(null);
        setDragOverIndex(null);
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
            <ul className={classnames("todo-list") } data-testid="todo-list">
                {visibleTodos.map((todo, index) => (
                    <Item
                        todo={todo}
                        key={todo.id}
                        dispatch={dispatch}
                      draggable={!index && false }
                      onDragStart={() => onDragStart(index)}
                        onDragOver={(e) => onDragOver(index, e)}
                      onDrop={(e) => onDrop(index, e)}
                        onDragEnd={onDragEnd}
                        isDragging={dragIndex === index}
                        isDragOver={dragOverIndex === index && dragIndex !== null && dragIndex !== index}
                    />
                ))}
            </ul>
        </main>
    );
}

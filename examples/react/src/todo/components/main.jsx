import { useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { Item } from "./item";
import classnames from "classnames";

import { TOGGLE_ALL, REORDER_ITEMS } from "../constants";

export function Main({ todos, dispatch }) {
    const { pathname: route } = useLocation();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const sortedTodos = useMemo(() => [...todos].sort((a, b) => (a.order || 0) - (b.order || 0)), [todos]);

    const visibleTodos = useMemo(
        () =>
            sortedTodos.filter((todo) => {
                if (route === "/active")
                    return !todo.completed;

                if (route === "/completed")
                    return todo.completed;

                return true;
            }),
        [sortedTodos, route]
    );

    const toggleAll = useCallback((e) => dispatch({ type: TOGGLE_ALL, payload: { completed: e.target.checked } }), [dispatch]);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            dispatch({ type: REORDER_ITEMS, payload: { activeId: active.id, overId: over.id } });
        }
    }, [dispatch]);

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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={visibleTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <ul className={classnames("todo-list")} data-testid="todo-list">
                        {visibleTodos.map((todo, index) => (
                            <Item todo={todo} key={todo.id} dispatch={dispatch} index={index} />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </main>
    );
}

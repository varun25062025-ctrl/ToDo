import { useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { 
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { Item } from "./item";
import classnames from "classnames";

import { TOGGLE_ALL, REORDER_TODOS } from "../constants";

export function Main({ todos, dispatch }) {
    const { pathname: route } = useLocation();

    // Sort by order first, then filter by route
    const sortedTodos = useMemo(
        () => [...todos].sort((a, b) => (a.order || 0) - (b.order || 0)),
        [todos]
    );

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

    const toggleAll = useCallback(
        (e) => dispatch({ type: TOGGLE_ALL, payload: { completed: e.target.checked } }), 
        [dispatch]
    );

    // Configure DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // Require 8px movement to activate drag
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handle drag end
    const handleDragEnd = useCallback(
        (event) => {
            const { active, over } = event;

            // No-op if dropped outside or on itself
            if (!over || active.id === over.id) return;

            dispatch({
                type: REORDER_TODOS,
                payload: {
                    activeId: active.id,
                    overId: over.id,
                    filter: route
                }
            });
        },
        [dispatch, route]
    );

    return (
        <main className="main" data-testid="main">
            {visibleTodos.length > 0 ? (
                <div className="toggle-all-container">
                    <input 
                        className="toggle-all" 
                        type="checkbox" 
                        id="toggle-all" 
                        data-testid="toggle-all" 
                        checked={visibleTodos.every((todo) => todo.completed)} 
                        onChange={toggleAll} 
                    />
                    <label className="toggle-all-label" htmlFor="toggle-all">
                        Toggle All Input
                    </label>
                </div>
            ) : null}
            
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={visibleTodos.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className={classnames("todo-list")} data-testid="todo-list">
                        {visibleTodos.map((todo, index) => (
                            <Item 
                                todo={todo} 
                                key={todo.id} 
                                dispatch={dispatch} 
                                index={index} 
                            />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
        </main>
    );
}

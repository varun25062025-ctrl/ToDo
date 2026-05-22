import {
    ADD_ITEM,
    REMOVE_ALL_ITEMS,
    REMOVE_COMPLETED_ITEMS,
    REMOVE_ITEM,
    REORDER_ITEMS,
    TOGGLE_ALL,
    TOGGLE_ITEM,
    UPDATE_ITEM,
} from "./constants";
import { todoReducer } from "./reducer";

const baseTodos = [
    { id: "a", title: "Task A", completed: false },
    { id: "b", title: "Task B", completed: true },
    { id: "c", title: "Task C", completed: false },
];

describe("todoReducer", () => {
    it("adds a new todo", () => {
        const next = todoReducer([], { type: ADD_ITEM, payload: { title: "New Task" } });

        expect(next).toHaveLength(1);
        expect(next[0].title).toBe("New Task");
        expect(next[0].completed).toBe(false);
        expect(typeof next[0].id).toBe("string");
        expect(next[0].id.length).toBeGreaterThan(0);
    });

    it("updates a todo title", () => {
        const next = todoReducer(baseTodos, { type: UPDATE_ITEM, payload: { id: "a", title: "Task A updated" } });

        expect(next[0].title).toBe("Task A updated");
        expect(next[1].title).toBe("Task B");
    });

    it("removes a todo", () => {
        const next = todoReducer(baseTodos, { type: REMOVE_ITEM, payload: { id: "b" } });

        expect(next.map((todo) => todo.id)).toEqual(["a", "c"]);
    });

    it("toggles a single todo", () => {
        const next = todoReducer(baseTodos, { type: TOGGLE_ITEM, payload: { id: "a" } });

        expect(next[0].completed).toBe(true);
        expect(next[1].completed).toBe(true);
    });

    it("toggles all visible todos", () => {
        const next = todoReducer(baseTodos, { type: TOGGLE_ALL, payload: { completed: true } });

        expect(next.every((todo) => todo.completed)).toBe(true);
    });

    it("removes all completed todos", () => {
        const next = todoReducer(baseTodos, { type: REMOVE_COMPLETED_ITEMS });

        expect(next).toEqual([
            { id: "a", title: "Task A", completed: false },
            { id: "c", title: "Task C", completed: false },
        ]);
    });

    it("removes all todos", () => {
        const next = todoReducer(baseTodos, { type: REMOVE_ALL_ITEMS });

        expect(next).toEqual([]);
    });

    it("reorders visible todos when dropping onto another visible todo", () => {
        const next = todoReducer(baseTodos, {
            type: REORDER_ITEMS,
            payload: {
                visibleIds: ["a", "b", "c"],
                draggedId: "c",
                targetId: "a",
            },
        });

        expect(next.map((todo) => todo.id)).toEqual(["c", "a", "b"]);
    });

    it("keeps hidden items in place while reordering filtered visible todos", () => {
        const next = todoReducer(baseTodos, {
            type: REORDER_ITEMS,
            payload: {
                visibleIds: ["a", "c"],
                draggedId: "c",
                targetId: "a",
            },
        });

        expect(next.map((todo) => todo.id)).toEqual(["c", "b", "a"]);
    });

    it("returns unchanged state for invalid reorder payload", () => {
        const next = todoReducer(baseTodos, {
            type: REORDER_ITEMS,
            payload: {
                visibleIds: ["a", "c"],
                draggedId: "a",
                targetId: "missing-id",
            },
        });

        expect(next).toEqual(baseTodos);
    });

    it("returns unchanged state when dragged and target ids are the same", () => {
        const next = todoReducer(baseTodos, {
            type: REORDER_ITEMS,
            payload: {
                visibleIds: ["a", "b", "c"],
                draggedId: "b",
                targetId: "b",
            },
        });

        expect(next).toEqual(baseTodos);
    });

    it("returns unchanged state when dragged or target ids are missing", () => {
        const missingDragged = todoReducer(baseTodos, {
            type: REORDER_ITEMS,
            payload: {
                visibleIds: ["a", "b", "c"],
                draggedId: null,
                targetId: "a",
            },
        });

        const missingTarget = todoReducer(baseTodos, {
            type: REORDER_ITEMS,
            payload: {
                visibleIds: ["a", "b", "c"],
                draggedId: "a",
                targetId: null,
            },
        });

        expect(missingDragged).toEqual(baseTodos);
        expect(missingTarget).toEqual(baseTodos);
    });

    it("throws for unknown actions", () => {
        expect(() => todoReducer(baseTodos, { type: "UNKNOWN_ACTION" })).toThrow("Unknown action: UNKNOWN_ACTION");
    });
});

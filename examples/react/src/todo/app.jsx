import { useReducer, useEffect } from "react";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";

import { todoReducer } from "./reducer";

import "./app.css";

const STORAGE_KEY = "todos-react-dndkit";

export function App() {
    const [todos, dispatch] = useReducer(
        todoReducer,
        [],
        () => {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    return parsed.map((todo, index) => ({
                        ...todo,
                        order: todo.order !== undefined ? todo.order : index
                    }));
                } catch (e) {
                    console.error("Failed to parse localStorage:", e);
                    return [];
                }
            }
            return [];
        }
    );

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (e) {
            console.error("Failed to save to localStorage:", e);
        }
    }, [todos]);

    return (
        <>
            <Header dispatch={dispatch} />
            <Main todos={todos} dispatch={dispatch} />
            <Footer todos={todos} dispatch={dispatch} />
        </>
    );
}

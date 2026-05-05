import { useReducer, useEffect } from "react";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";

import { todoReducer, migrateTodos } from "./reducer";

import "./app.css";

const STORAGE_KEY = "todos";

export function App() {
    // Initialize todos from localStorage with migration
    const [todos, dispatch] = useReducer(
        todoReducer,
        [],
        () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    return migrateTodos(parsed);
                }
            } catch (err) {
                console.error("Failed to load todos from localStorage:", err);
            }
            return [];
        }
    );

    // Persist todos to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (err) {
            console.error("Failed to save todos to localStorage:", err);
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

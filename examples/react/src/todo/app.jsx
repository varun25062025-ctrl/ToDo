import { useReducer, useEffect } from "react";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";

import { todoReducer } from "./reducer";

import "./app.css";

const STORAGE_KEY = "react-todos-orderable";

function loadTodos() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to load todos from localStorage:", error);
        return [];
    }
}

export function App() {
    const [todos, dispatch] = useReducer(todoReducer, [], loadTodos);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (error) {
            console.error("Failed to save todos to localStorage:", error);
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

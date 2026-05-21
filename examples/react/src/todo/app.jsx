import { useEffect, useReducer } from "react";
import { Header } from "./components/header";
import { Main } from "./components/main";
import { Footer } from "./components/footer";

import { todoReducer } from "./reducer";

import "./app.css";

const STORAGE_KEY = "todos-react-orderable";

function loadTodos() {
    if (typeof window === "undefined")
        return [];

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

export function App() {
    const [todos, dispatch] = useReducer(todoReducer, undefined, loadTodos);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    return (
        <>
            <Header dispatch={dispatch} />
            <Main todos={todos} dispatch={dispatch} />
            <Footer todos={todos} dispatch={dispatch} />
        </>
    );
}

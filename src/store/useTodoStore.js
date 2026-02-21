import { create } from 'zustand';

const CATEGORY_COLORS = {
    Work: '#4f8ef7',
    Personal: '#a855f7',
    Urgent: '#ef4444',
};

const PRIORITY_COLORS = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#22c55e',
};

let counter = 0;

const useTodoStore = create((set) => ({
    todos: [],

    addTodo: (text, category = 'Work', priority = 'Medium') => {
        const id = `todo-${Date.now()}-${counter++}`;
        set((state) => ({
            todos: [
                ...state.todos,
                {
                    id,
                    text,
                    category,
                    priority,
                    completed: false,
                    deleting: false,
                    createdAt: Date.now(),
                },
            ],
        }));
    },

    completeTodo: (id) => {
        set((state) => ({
            todos: state.todos.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            ),
        }));
    },

    markDeleting: (id) => {
        set((state) => ({
            todos: state.todos.map((t) =>
                t.id === id ? { ...t, deleting: true } : t
            ),
        }));
    },

    deleteTodo: (id) => {
        set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
    },
}));

export { CATEGORY_COLORS, PRIORITY_COLORS };
export default useTodoStore;

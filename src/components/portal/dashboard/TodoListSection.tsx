"use client";

import { useEffect, useState } from "react";

function useMountAnimation(delay: number) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return mounted;
}

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

// TODO: Fetch todos from database
const INITIAL_TODOS: TodoItem[] = [
  { id: 1, text: "Task 1", completed: false },
  { id: 2, text: "Task 2", completed: false },
  { id: 3, text: "Task 3", completed: false },
  { id: 4, text: "Task 4", completed: false },
  { id: 5, text: "Task 5", completed: false },
];

export default function TodoListSection() {
  const mounted = useMountAnimation(160);
  const enterClasses = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3";

  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const addTask = () => {
    const newId = Math.max(...todos.map((t) => t.id), 0) + 1;
    setTodos((prev) => [...prev, { id: newId, text: `Task ${newId}`, completed: false }]);
  };

  return (
    <section
      className={`transform transition-all duration-300 ease-out ${enterClasses}`}
      style={{ transitionDelay: "160ms" }}
    >
      <h2 className="text-xs font-semibold tracking-wide text-black/50 uppercase mb-4">
        To-Do List
      </h2>
      <div className="rounded-2xl border border-[#D4D7E5] bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {todos.map((todo) => (
            <label
              key={todo.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-4 h-4 rounded border-gray-300 text-[#3F86FF] focus:ring-[#3F86FF] cursor-pointer"
              />
              <span
                className={`text-sm ${
                  todo.completed
                    ? "line-through text-black/40"
                    : "text-black/80 group-hover:text-black"
                }`}
              >
                {todo.text}
              </span>
            </label>
          ))}
        </div>

        <button
          onClick={addTask}
          className="mt-4 text-sm text-black/60 hover:text-black transition-colors"
        >
          + Add task
        </button>
      </div>
    </section>
  );
}

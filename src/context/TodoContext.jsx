import React, { createContext, useContext, useCallback, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { createTask } from '../utils/helpers';

/**
 * STATE MANAGEMENT EXPLANATION:
 * 
 * We use React Context to share state across all components
 * without "prop drilling" (passing props through many levels).
 * 
 * Think of Context like a "global store" that any component
 * can read from or write to. It's simpler than Redux but
 * works great for small-to-medium apps.
 * 
 * Flow:
 * TodoProvider (holds all state)
 *   └── Any child component can useTodo() to access state & actions
 */

const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
  // All tasks stored in a single array, persisted in localStorage
  const [tasks, setTasks] = useLocalStorage('todo-tasks', []);
  
  // Theme preference also persisted
  const [darkMode, setDarkMode] = useLocalStorage('todo-dark-mode', false);

  // ============ TASK ACTIONS ============

  /**
   * Add a new task to the list.
   * useCallback prevents unnecessary re-creation of this function,
   * which helps performance when passed as a prop.
   */
  const addTask = useCallback((title, description, category) => {
    const newTask = createTask(title, description, category);
    setTasks(prev => [newTask, ...prev]);
  }, [setTasks]);

  /**
   * Update an existing task by merging new fields into it.
   * The spread operator (...updates) overwrites only the
   * fields that are passed in, keeping everything else.
   */
  const updateTask = useCallback((id, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }, [setTasks]);

  /**
   * Remove a task permanently.
   * filter() creates a new array excluding the deleted task.
   */
  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  /**
   * Toggle the completed status of a task.
   * If marking as completed, also move it to 'done' category.
   * If uncompleting, move it back to 'todo'.
   */
  const toggleComplete = useCallback((id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              category: !task.completed ? 'done' : 'todo',
            }
          : task
      )
    );
  }, [setTasks]);

  /**
   * REORDER TASKS — This is called after a drag-and-drop event.
   * 
   * How it works:
   * 1. We receive the full updated array from the drag handler
   * 2. We simply replace the entire tasks array
   * 
   * This approach is simpler than calculating indices manually.
   */
  const reorderTasks = useCallback((newTasks) => {
    setTasks(newTasks);
  }, [setTasks]);

  /**
   * Move a task to a different category (column).
   * Used when dragging a task from one column to another.
   */
  const moveTask = useCallback((taskId, newCategory) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? {
              ...task,
              category: newCategory,
              completed: newCategory === 'done',
            }
          : task
      )
    );
  }, [setTasks]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, [setDarkMode]);

  // ============ COMPUTED VALUES ============

  /**
   * useMemo caches these calculations so they only re-run
   * when the tasks array actually changes, not on every render.
   */
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }, [tasks]);

  // Group tasks by category for the Kanban board view
  const tasksByCategory = useMemo(() => ({
    todo: tasks.filter(t => t.category === 'todo'),
    inprogress: tasks.filter(t => t.category === 'inprogress'),
    done: tasks.filter(t => t.category === 'done'),
  }), [tasks]);

  // Bundle everything into a single value object
  const value = {
    tasks,
    darkMode,
    stats,
    tasksByCategory,
    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasks,
    moveTask,
    toggleDarkMode,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

/**
 * Custom hook for consuming the context.
 * This gives a clean API: const { tasks, addTask } = useTodo();
 */
export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
import React, { useState } from 'react';
import { TodoProvider, useTodo } from './context/TodoContext';
import Header from './components/Header';
import TaskList from './components/TaskList';
import AddTaskModal from './components/AddTaskModal';
import './App.css';

/**
 * Inner app component that can access the TodoContext.
 * We need this separation because useTodo() must be called
 * inside a TodoProvider.
 */
const AppContent = () => {
  const { darkMode } = useTodo();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <div className="app-container">
        <Header onAddClick={() => setIsModalOpen(true)} />
        <TaskList />
        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

/**
 * Root App component.
 * TodoProvider wraps everything so all components can access shared state.
 */
const App = () => {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
};

export default App;
import React from 'react';
import { motion } from 'framer-motion';
import { useTodo } from '../context/TodoContext';

/**
 * A smooth animated toggle switch for dark/light mode.
 * The circle slides left/right using Framer Motion's layout animation.
 */
const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTodo();

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleDarkMode}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle dark mode"
    >
      {/* The sliding circle indicator */}
      <motion.div
        className="toggle-thumb"
        layout // Framer Motion auto-animates position changes
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          left: darkMode ? '28px' : '4px',
        }}
      />
      {/* Sun and Moon icons */}
      <span className="toggle-icon sun">☀️</span>
      <span className="toggle-icon moon">🌙</span>
    </motion.button>
  );
};

export default ThemeToggle;
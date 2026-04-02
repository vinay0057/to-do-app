import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import ProgressBar from './ProgressBar';

/**
 * App header with title, theme toggle, and progress bar.
 * Uses Framer Motion for a smooth entrance animation.
 */
const Header = ({ onAddClick }) => {
  return (
    <motion.header
      className="header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-top">
        <div className="header-title-group">
          <h1 className="header-title">
            ✨ TaskFlow
          </h1>
          <p className="header-subtitle">
            Organize your day, achieve your goals
          </p>
        </div>
        
        <div className="header-actions">
          <ThemeToggle />
          <motion.button
            className="add-task-btn"
            onClick={onAddClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">Add Task</span>
          </motion.button>
        </div>
      </div>
      
      <ProgressBar />
    </motion.header>
  );
};

export default Header;
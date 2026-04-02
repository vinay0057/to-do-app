import React from 'react';
import { motion } from 'framer-motion';
import { useTodo } from '../context/TodoContext';

/**
 * Visual progress indicator showing completion status.
 * The bar width animates smoothly when tasks are completed.
 */
const ProgressBar = () => {
  const { stats } = useTodo();

  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-label">
          Progress
        </span>
        <span className="progress-count">
          {stats.completed}/{stats.total} tasks completed
        </span>
      </div>
      
      <div className="progress-bar-track">
        {/* 
          motion.div with animate prop creates smooth width transitions.
          The width is driven by the completion percentage.
        */}
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${stats.percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      
      <span className="progress-percentage">{stats.percentage}%</span>
    </div>
  );
};

export default ProgressBar;
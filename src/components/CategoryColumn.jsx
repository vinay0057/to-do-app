import React from 'react';
import { motion } from 'framer-motion';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import { CATEGORIES } from '../utils/helpers';
import { useTodo } from '../context/TodoContext';

const CategoryColumn = ({ categoryId }) => {
  const { tasksByCategory } = useTodo();
  const category = CATEGORIES[categoryId];
  const tasks = tasksByCategory[categoryId];

  const { setNodeRef, isOver } = useDroppable({
    id: categoryId,
  });

  return (
    <motion.div
      className={`category-column ${isOver ? 'drag-over' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="column-header" style={{ borderColor: category.color }}>
        <h2 className="column-title">{category.title}</h2>
        <span
          className="task-count"
          style={{ backgroundColor: category.color }}
        >
          {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef} className="task-list">
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {/* Show empty state only when no tasks exist */}
        {tasks.length === 0 && (
          <div className="empty-column">
            <span className="empty-icon">📭</span>
            <p>No tasks yet</p>
            <p className="empty-hint">Drag tasks here or add new ones</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryColumn;
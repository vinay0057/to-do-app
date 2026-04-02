import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTodo } from '../context/TodoContext';

const TaskCard = ({ task }) => {
  const { updateTask, deleteTask, toggleComplete } = useTodo();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  // KEY FIX: When dragging, completely hide the original card
  // The DragOverlay component shows the floating copy instead
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Hide the original card while dragging so there's no duplicate
    opacity: isDragging ? 0 : 1,
    // Remove the card from visual flow while dragging
    // so the column doesn't expand with empty space
    height: isDragging ? 0 : 'auto',
    padding: isDragging ? 0 : undefined,
    margin: isDragging ? 0 : undefined,
    overflow: isDragging ? 'hidden' : undefined,
    border: isDragging ? 'none' : undefined,
  };

  const handleSave = () => {
    if (editTitle.trim()) {
      updateTask(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${task.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
    >
      {/* Only render content when NOT dragging */}
      {!isDragging && (
        <>
          {/* Drag handle */}
          <div className="drag-handle" {...attributes} {...listeners}>
            <span className="drag-dots">⠿</span>
          </div>

          <div className="task-content">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="edit-input"
                  placeholder="Task title..."
                  autoFocus
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="edit-textarea"
                  placeholder="Description (optional)..."
                  rows={2}
                />
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-header">
                  <motion.button
                    className={`checkbox ${task.completed ? 'checked' : ''}`}
                    onClick={() => toggleComplete(task.id)}
                    whileTap={{ scale: 0.8 }}
                  >
                    {task.completed && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="checkmark"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>

                  <div className="task-text">
                    <h3 className={`task-title ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="task-description">{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="task-actions">
                  <motion.button
                    className="action-btn edit"
                    onClick={() => setIsEditing(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Edit task"
                  >
                    ✏️
                  </motion.button>
                  <motion.button
                    className="action-btn delete"
                    onClick={() => deleteTask(task.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete task"
                  >
                    🗑️
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
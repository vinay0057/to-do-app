import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import CategoryColumn from './CategoryColumn';
import { useTodo } from '../context/TodoContext';

const TaskList = () => {
  const { tasks, reorderTasks, moveTask, tasksByCategory } = useTodo();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id) => {
    if (['todo', 'inprogress', 'done'].includes(id)) {
      return id;
    }
    const task = tasks.find(t => t.id === id);
    return task?.category || null;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (activeContainer && overContainer && activeContainer !== overContainer) {
      moveTask(active.id, overContainer);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;

    if (activeContainer !== overContainer) {
      moveTask(active.id, overContainer);
      return;
    }

    if (active.id !== over.id) {
      const containerTasks = tasksByCategory[activeContainer];
      const oldIndex = containerTasks.findIndex(t => t.id === active.id);
      const newIndex = containerTasks.findIndex(t => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = [...containerTasks];
        const [moved] = reordered.splice(oldIndex, 1);
        reordered.splice(newIndex, 0, moved);

        const otherTasks = tasks.filter(t => t.category !== activeContainer);
        reorderTasks([...otherTasks, ...reordered]);
      }
    }
  };

  // Also clear activeId if drag is cancelled
  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="board">
        <CategoryColumn categoryId="todo" />
        <CategoryColumn categoryId="inprogress" />
        <CategoryColumn categoryId="done" />
      </div>

      {/* 
        DragOverlay: This is the ONLY visible copy while dragging.
        It floats above everything and follows the cursor.
      */}
      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="task-card drag-overlay-card">
            <div className="drag-handle">
              <span className="drag-dots">⠿</span>
            </div>
            <div className="task-content">
              <div className="task-header">
                <div className={`checkbox ${activeTask.completed ? 'checked' : ''}`}>
                  {activeTask.completed && <span className="checkmark">✓</span>}
                </div>
                <div className="task-text">
                  <h3 className={`task-title ${activeTask.completed ? 'line-through' : ''}`}>
                    {activeTask.title}
                  </h3>
                  {activeTask.description && (
                    <p className="task-description">{activeTask.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskList;
// src/utils/helpers.js

import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new task object with a unique ID and timestamp.
 * Using UUID ensures no two tasks ever have the same ID,
 * which is critical for drag-and-drop to work correctly.
 */
export const createTask = (title, description = '', category = 'todo') => ({
  id: uuidv4(),
  title,
  description,
  category,
  completed: false,
  createdAt: new Date().toISOString(),
});

/**
 * Category configuration — single source of truth for
 * labels, colors, and ordering of columns.
 */
export const CATEGORIES = {
  todo: {
    id: 'todo',
    title: '📋 To Do',
    color: '#6366f1',
    lightColor: '#eef2ff',
    darkColor: '#312e81',
  },
  inprogress: {
    id: 'inprogress',
    title: '⚡ In Progress',
    color: '#f59e0b',
    lightColor: '#fffbeb',
    darkColor: '#78350f',
  },
  done: {
    id: 'done',
    title: '✅ Done',
    color: '#10b981',
    lightColor: '#ecfdf5',
    darkColor: '#064e3b',
  },
};
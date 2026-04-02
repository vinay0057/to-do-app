import { useState, useEffect } from 'react';

/**
 * Custom hook that syncs state with localStorage.
 * This means tasks persist even after the browser is closed.
 * 
 * How it works:
 * 1. On first load, it checks localStorage for existing data
 * 2. If found, it uses that data as initial state
 * 3. Every time the state changes, it saves to localStorage
 */
const useLocalStorage = (key, initialValue) => {
  // Lazy initialization: only read from localStorage once on mount
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse the JSON string back into an object/array
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Save to localStorage whenever the value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
import { useState, useEffect } from "react";

export function useLocalStorage(initialValue, key) {
  const [value, setValue] = useState(() => {
    const oldWatched = localStorage.getItem(key);
    return oldWatched ? JSON.parse(oldWatched) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

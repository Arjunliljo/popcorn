import { useEffect } from "react";

export function useKey(key, callback) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === key) callback();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [callback, key]);
}

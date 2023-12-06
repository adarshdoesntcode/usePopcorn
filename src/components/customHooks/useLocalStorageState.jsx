import { useEffect, useState } from "react";

export function useLocalStorageState(key) {
  const [value, setValue] = useState(() => {
    const storage = JSON.parse(localStorage.getItem(key));
    return storage ? storage : [];
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}

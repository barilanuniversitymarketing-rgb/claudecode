import { useState, useCallback } from "react";
import { CHILDREN } from "../data/children";

const STORAGE_KEY = "homeschool-names";

function loadNames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useChildNames() {
  const [names, setNames] = useState(loadNames);

  const getChildName = useCallback(
    (id) => {
      if (names[id]) return names[id];
      const child = CHILDREN.find((c) => c.id === id);
      return child ? child.name : id;
    },
    [names]
  );

  const setChildName = useCallback((id, name) => {
    setNames((prev) => {
      const updated = { ...prev, [id]: name };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  }, []);

  return [getChildName, setChildName];
}

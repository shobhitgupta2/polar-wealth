import { useCallback, useEffect, useState } from "react";

function safelyParseJSON<T>(value: string, defaultValue: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

function isLocalStorageAvailable(): boolean {
  try {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}

export interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T) => void;
  removeValue: () => void;
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): UseLocalStorageResult<T> {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    if (!isLocalStorageAvailable()) return;

    const stored = localStorage.getItem(key);
    if (stored !== null) {
      setValue(safelyParseJSON(stored, defaultValue));
    }
  }, [key, defaultValue]);

  const setValueCallback = useCallback(
    (newValue: T) => {
      setValue(newValue);
      if (isLocalStorageAvailable()) {
        try {
          localStorage.setItem(key, JSON.stringify(newValue));
        } catch {
          // silently fail — storage quota exceeded or unavailable
        }
      }
    },
    [key],
  );

  const removeValue = useCallback(() => {
    setValue(defaultValue);
    if (isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(key);
      } catch {
        // silently fail
      }
    }
  }, [key, defaultValue]);

  return { value, setValue: setValueCallback, removeValue };
}
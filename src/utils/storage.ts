/**
 * Universal safe storage wrapper.
 * Works seamlessly in all browsers, including:
 * - Safari / Chrome / Firefox Incognito & Private Browsing
 * - Sandboxed iframes
 * - Browsers with cookies or third-party storage strictly disabled
 * Never throws exceptions, falls back to in-memory store automatically.
 */

const memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = isLocalStorageAvailable();

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (storageAvailable) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Fallback
    }
    return memoryStore[key] ?? null;
  },

  setItem(key: string, value: string): void {
    try {
      if (storageAvailable) {
        window.localStorage.setItem(key, value);
      }
    } catch {
      // Fallback
    }
    memoryStore[key] = value;
  },

  removeItem(key: string): void {
    try {
      if (storageAvailable) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Fallback
    }
    delete memoryStore[key];
  },
};

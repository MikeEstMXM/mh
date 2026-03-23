const STORAGE_KEY = "app-api-password";

export function getApiPassword(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

export function setApiPassword(value: string) {
  window.localStorage.setItem(STORAGE_KEY, value);
}

export function clearApiPassword() {
  window.localStorage.removeItem(STORAGE_KEY);
}

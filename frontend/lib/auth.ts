import type { AuthResponse, User } from "@/lib/types";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem("token");
}


export function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem("user");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}


export function storeSession(auth: AuthResponse) {
  window.localStorage.setItem("token", auth.access_token);
  window.localStorage.setItem("user", JSON.stringify(auth.user));
}


export function clearSession() {
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
}

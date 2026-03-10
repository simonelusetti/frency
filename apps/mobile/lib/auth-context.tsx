import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import type { AuthResponse, User } from "@/lib/types";

type AuthContextValue = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  storeSession: (auth: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
};

const TOKEN_KEY = "frency_token";
const USER_KEY = "frency_user";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    Promise.all([SecureStore.getItemAsync(TOKEN_KEY), SecureStore.getItemAsync(USER_KEY)])
      .then(([storedToken, storedUser]) => {
        setToken(storedToken);
        setUser(storedUser ? (JSON.parse(storedUser) as User) : null);
      })
      .finally(() => setHydrated(true));
  }, []);

  async function storeSession(auth: AuthResponse) {
    setToken(auth.access_token);
    setUser(auth.user);
    await Promise.all([
      SecureStore.setItemAsync(TOKEN_KEY, auth.access_token),
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(auth.user)),
    ]);
  }

  async function logout() {
    setToken(null);
    setUser(null);
    await Promise.all([SecureStore.deleteItemAsync(TOKEN_KEY), SecureStore.deleteItemAsync(USER_KEY)]);
    router.replace("/(auth)/welcome");
  }

  return (
    <AuthContext.Provider value={{ token, user, hydrated, storeSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

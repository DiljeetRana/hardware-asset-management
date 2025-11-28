"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {jwtDecode} from "jwt-decode";

type DecodedToken = {
  id: string;
  role: string;
  exp: number;
};

type AuthContextType = {
  user: string | null;
  role: string | null;
  loading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Run once on app load
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/profile", { credentials: "include" });
      if (!res.ok) {
   setLoading(false);
   return;
}
      const data = await res.json();
      setUser(data.id);
      setRole(data.role);
    } catch (err) {
      console.error("Auth fetch error:", err);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  // useEffect(() => {
  //   try {
  //     const token = getCookie("token");
  //     if (!token) {
  //       setLoading(false);
  //       return;
  //     }

  //     const decoded = jwtDecode<DecodedToken>(token); // { id, role, exp }

  //     // Check expiration
  //     if (decoded.exp * 1000 < Date.now()) {
  //       removeCookie("token");
  //       setLoading(false);
  //       return;
  //     }

  //     setUser(decoded.id);
  //     setRole(decoded.role);
  //   } catch (err) {
  //     console.error("Auth decode error:", err);
  //     removeCookie("token");
  //   }

  //   setLoading(false);
  // }, []);

  // Helper to read cookie
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;

    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  };

  // Helper to delete cookie
  const removeCookie = (name: string) => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };


  const logout = async () => {
  try {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout API error:", err);
  } finally {
    setUser(null);
    setRole(null);
    window.location.href = "/login";
  }
};


  return (
    <AuthContext.Provider
      value={{ user, role, loading, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

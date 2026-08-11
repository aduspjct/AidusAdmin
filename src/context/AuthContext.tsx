"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Admin credentials - stored here for simplicity
// In production, consider using environment variables or a secure backend
const ADMIN_EMAIL = "adusservice.project@gmail.com";
const ADMIN_PASSWORD = "Aidus@123";
const AUTH_TOKEN_KEY = "admin_auth_token";
const AUTH_SESSION_KEY = "admin_session";

// Simple user type for admin
type AdminUser = {
  email: string;
  uid: string;
};

type AuthContextType = {
  user: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated (on mount or page refresh)
    const checkAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const token = sessionStorage.getItem(AUTH_TOKEN_KEY);
          const sessionData = sessionStorage.getItem(AUTH_SESSION_KEY);
          
          if (token && sessionData) {
            try {
              const userData = JSON.parse(sessionData);
              setUser(userData);
            } catch (e) {
              // Invalid session data, clear it
              sessionStorage.removeItem(AUTH_TOKEN_KEY);
              sessionStorage.removeItem(AUTH_SESSION_KEY);
            }
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Validate admin credentials
    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase()) {
      throw new Error("Invalid email or password");
    }

    if (password !== ADMIN_PASSWORD) {
      throw new Error("Invalid email or password");
    }

    try {
      // Create a simple session
      const adminUser: AdminUser = {
        email: ADMIN_EMAIL,
        uid: "admin_001", // Simple identifier
      };

      // Store in sessionStorage (cleared when browser closes)
      if (typeof window !== "undefined") {
        const token = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(adminUser));
      }

      setUser(adminUser);
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in");
    }
  };

  const signOut = async () => {
    try {
      // Clear session storage
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_SESSION_KEY);
      }
      setUser(null);
      router.push("/adminconsole/login");
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

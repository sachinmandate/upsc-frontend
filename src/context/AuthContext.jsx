import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("auth_user");
    const savedToken = localStorage.getItem("auth_token");

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role = 'student') => {
    // --- MOCK LOGIN FOR PRESENTATION ---
    const userData = {
      id: 1,
      email: email.trim(),
      firstName: "Demo",
      lastName: role.charAt(0).toUpperCase() + role.slice(1),
      role: role.toLowerCase()
    };
    const dummyToken = "mock_token_" + role;
    
    setUser(userData);
    setToken(dummyToken);
    localStorage.setItem("auth_token", dummyToken);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    
    return { success: true, user: userData };
  };

  const register = async (formData, role = 'student') => {
    // --- MOCK REGISTRATION FOR PRESENTATION ---
    return { success: true, message: "Registration successful! (Demo Mode)" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

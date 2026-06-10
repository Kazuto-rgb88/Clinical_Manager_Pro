import { createContext, useState, useContext, useEffect } from "react";
import client from "../api/axios";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]); // Nueva bolsa para guardar errores

  // Función para registrarse
  const signup = async (user) => {
    try {
      await client.post("/auth/registrar", user);
    } catch (error) {
      setErrors(error.response.data.message || ["Error al registrar"]);
    }
  };

  // Función para iniciar sesión
  const signin = async (userData) => {
    try {
      const res = await client.post("/auth/login", userData);

      // CAMBIO 1: El Backend devuelve { token, nombre, mensaje }.
      // Guardamos TODO el objeto res.data en el estado 'user'
      setUser(res.data);
      setIsAuthenticated(true);
      setErrors([]);

      // CAMBIO 2: Guardamos el token Y el nombre (o el objeto usuario) en localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data)); // Guardamos nombre y datos como texto
    } catch (error) {
      setErrors(error.response.data.message || ["Credenciales incorrectas"]);
    }
  };

  // Efecto para limpiar errores después de 5 segundos (Opcional pero muy Pro)
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => setErrors([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Aquí es donde sucede la magia: verificamos si hay token al cargar la app
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user"); // CAMBIO 3: Intentamos recuperar al usuario

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }

      // CAMBIO 4: Si hay token y usuario guardado, los ponemos en el motor de React
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Convertimos el texto de vuelta a objeto
      }

      setIsAuthenticated(true);
      setLoading(false);
    };
    checkLogin();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // CAMBIO 5: Limpiamos también al usuario
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ signup, signin, logout, user, isAuthenticated, loading, errors }}
    >
      {children}
    </AuthContext.Provider>
  );
};

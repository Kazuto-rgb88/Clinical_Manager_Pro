import axios from "axios";

// Creamos una instancia centralizada para no repetir la URL cada vez
const client = axios.create({
  // Lo llamamos 'client' para que coincida con tus imports
  baseURL: "https://clinical-manager-backend.onrender.com/api", // La dirección de tu motor de Node
  withCredentials: true, // Esto será útil para cookies y seguridad más adelante
});

// 🚨 ESTA ES LA MODIFICACIÓN CRÍTICA 🚨
// Este interceptor "atrapa" cada petición y le pone el Token de seguridad
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Importante: Asegúrate de que sea 'Authorization' con 'A' mayúscula
      config.headers.Authorization = `Bearer ${token}`; // Aquí pegamos la identificación
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default client;

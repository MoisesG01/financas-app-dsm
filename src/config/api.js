import axios from "axios";

// URL base da API - ajuste conforme necessário
// Para emulador Android: http://10.0.2.2:3000/api
// Para dispositivo físico: http://SEU_IP_LOCAL:3000/api (ex: http://192.168.1.100:3000/api)
const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api" // Desenvolvimento
  : "http://localhost:3000/api"; // Produção - ajuste conforme necessário

// Criar instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  async (config) => {
    const { storage } = await import("../services/storage");
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      const { storage } = await import("../services/storage");
      await storage.removeToken();
      // Você pode redirecionar para a tela de login aqui
    }
    return Promise.reject(error);
  }
);

export default api;

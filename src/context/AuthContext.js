import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, usuarioService } from '../services/api';
import { storage } from '../services/storage';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await storage.getToken();
      const userData = await storage.getUser();

      if (token && userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao carregar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      
      await storage.saveToken(response.token);
      await storage.saveUser(response.usuario);
      
      setUser(response.usuario);
      setIsAuthenticated(true);
      
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao fazer login',
      };
    }
  };

  const cadastrar = async (nome, email, senha) => {
    try {
      const response = await authService.cadastrar(nome, email, senha);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao cadastrar',
      };
    }
  };

  const logout = async () => {
    console.log('AuthContext: logout chamado');
    try {
      await storage.clearAll();
      console.log('AuthContext: storage limpo');
      setUser(null);
      setIsAuthenticated(false);
      console.log('AuthContext: estado atualizado');
    } catch (error) {
      console.error('AuthContext: erro no logout:', error);
      throw error;
    }
  };

  const atualizarPerfil = async (nome, email) => {
    try {
      const response = await usuarioService.atualizar(nome, email);
      await storage.saveUser(response.usuario);
      setUser(response.usuario);
      return { success: true, data: response };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao atualizar perfil',
      };
    }
  };

  const carregarPerfil = async () => {
    try {
      const perfil = await usuarioService.getPerfil();
      await storage.saveUser(perfil);
      setUser(perfil);
      return { success: true, data: perfil };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.erro || 'Erro ao carregar perfil',
      };
    }
  };

  const deletarConta = async () => {
    console.log('AuthContext: deletarConta chamado');
    try {
      console.log('AuthContext: chamando usuarioService.deletar()...');
      await usuarioService.deletar();
      console.log('AuthContext: conta deletada no backend');
      await storage.clearAll();
      console.log('AuthContext: storage limpo');
      setUser(null);
      setIsAuthenticated(false);
      console.log('AuthContext: estado atualizado');
      return { success: true };
    } catch (error) {
      console.error('AuthContext: erro ao deletar conta:', error);
      return {
        success: false,
        error: error.response?.data?.erro || error.message || 'Erro ao excluir conta',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        cadastrar,
        logout,
        atualizarPerfil,
        carregarPerfil,
        deletarConta,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};


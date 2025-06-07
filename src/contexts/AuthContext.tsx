import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface para o usuário
interface User {
  id: string;
  name: string;
  email: string;
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean; // Estado para verificar se o usuário está sendo carregado do storage
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor do contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Inicia carregando

  useEffect(() => {
    // Função para carregar o usuário do AsyncStorage ao iniciar o app
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('dentefier_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao carregar usuário do AsyncStorage:", error);
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    };

    loadUserFromStorage();
  }, []);

  // Função de login (simulada)
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulação: verificar se email e senha são válidos (ex: não vazios)
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: 'Dr. Usuário Teste', // Nome genérico
        email: email,
      };
      try {
        await AsyncStorage.setItem('dentefier_user', JSON.stringify(mockUser));
        setUser(mockUser);
        return true;
      } catch (error) {
        console.error("Erro ao salvar usuário no AsyncStorage:", error);
        return false;
      }
    }
    return false;
  };

  // Função de logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('dentefier_user');
      setUser(null);
    } catch (error) {
      console.error("Erro ao remover usuário do AsyncStorage:", error);
    }
  };

  // Valor fornecido pelo contexto
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  // Não renderiza os filhos até que o carregamento inicial do usuário seja concluído
  if (isLoading) {
    // Poderia retornar um componente de Loading aqui
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


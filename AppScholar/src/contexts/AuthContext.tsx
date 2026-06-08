import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/apiService'; 

interface User {
  id: number;
  name: string;
  email: string;
  role: 'STUDENT' | 'PROFESSOR' | 'ADMIN';
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  token: string | null;
  login(email: string, password: string): Promise<void>;
  logout(): void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedUser = await AsyncStorage.getItem('@AppScholar:user');
      const storagedToken = await AsyncStorage.getItem('@AppScholar:token');

      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser));
        setToken(storagedToken);
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function login(email: string, password: string) {
    try {

      const response = await api.post('/auth/login', { email, password });
      
      const { token: jwtToken, user: userData } = response.data;
      if (!jwtToken || !userData) {
        throw new Error('Resposta de autenticação inválida.');
      }

      setUser(userData);
      setToken(jwtToken);

      api.defaults.headers.Authorization = `Bearer ${jwtToken}`;

      await AsyncStorage.setItem('@AppScholar:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@AppScholar:token', jwtToken);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  function logout() {
    AsyncStorage.clear().then(() => {
      setUser(null);
      setToken(null);
    });
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type User = {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (correo: string, password: string) => Promise<void>;
  register: (
    nombre: string,
    correo: string,
    password: string,
    rol: string
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:4000/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (correo: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password }),
    });

    if (!res.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  const register = async (
    nombre: string,
    correo: string,
    password: string,
    rol: string
  ) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, password, rol }),
    });

    if (!res.ok) {
      throw new Error('Error al registrarse');
    }

    const data = await res.json();
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
};

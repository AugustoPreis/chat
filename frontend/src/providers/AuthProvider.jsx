import { useContext, createContext, useState } from 'react';
import request from '../utils/request';

const AuthContext = createContext();
const STORAGE_USER_KEY = 'user';

const parseUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_USER_KEY);

    if (user) {
      return JSON.parse(user);
    }

    return null;
  } catch {
    return null;
  }
}

const removeUser = () => {
  localStorage.removeItem(STORAGE_USER_KEY);
}

export default function AuthProvider(props) {
  const [user, setUser] = useState(parseUser);

  const login = async (values) => {
    const { usuario, senha } = values;

    return new Promise((resolve, reject) => {
      request('/login', {
        method: 'POST',
        auth: false,
        body: { usuario, senha },
      }).then((user) => {
        setUser(user);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
        resolve(user);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  const logout = () => {
    setUser(null);
    removeUser();
  }

  const isAuthenticated = () => {
    if (!user) {
      return false;
    }

    const { token } = user;

    return typeof token === 'string' && token.trim().length > 0;
  }

  const contextValue = {
    user,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider {...props}
      value={contextValue} />
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/*
  funções necessárias para lidar com o usuário fora de um componente React
*/

export function getUser() {
  return parseUser();
}

export function getToken() {
  const user = getUser();

  return user?.token || null;
}

export function logout() {
  removeUser();
}
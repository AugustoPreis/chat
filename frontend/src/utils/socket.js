import { io } from 'socket.io-client';
import { getToken } from '../providers/AuthProvider';

export function createSocket(auth = {}) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendPort = import.meta.env.VITE_BACKEND_PORT;

  return io([backendUrl, backendPort].join(':'), {
    autoConnect: false,
    auth: {
      token: getToken(),
      ...auth,
    },
  });
}
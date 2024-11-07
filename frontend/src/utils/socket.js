import { io } from 'socket.io-client';
import { getToken } from '../providers/AuthProvider';

export function createSocket(auth = {}) {
  return io('http://localhost:3000', {
    autoConnect: false,
    auth: {
      token: getToken(),
      ...auth,
    },
  });
}
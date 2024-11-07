import { createContext, useContext } from 'react';

export const ChatContext = createContext();

export function useChatContext() {
  return useContext(ChatContext);
}
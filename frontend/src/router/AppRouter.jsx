import React, { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//login não deve ser importado com lazy
import Login from '../pages/login';

const PrivateRoute = lazy(() => import('../components/PrivateRoute'));
const ListagemChats = lazy(() => import('../pages/listagem-chats'));
const Chat = lazy(() => import('../pages/chat'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index
          element={<Login />} />
        <Route path='/entrar'
          element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route index
            element={<ListagemChats />} />
          <Route path='/listagem-chats'
            element={<ListagemChats />} />
          <Route path='/chats/:id'
            element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
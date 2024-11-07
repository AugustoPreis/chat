import React from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/lib/locale/pt_BR';
import AppRouter from './router/AppRouter';
import AuthProvider from './providers/AuthProvider';

const root = createRoot(document.getElementById('root'));

root.render(
  <ConfigProvider locale={ptBR}>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </ConfigProvider>,
);
import React from 'react';
import { format } from 'date-fns';
import { Avatar, Card, Col, Row } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../providers/AuthProvider';
import Cadastro from '../login/Cadastro';

export default function UsuarioLogado() {
  const auth = useAuth();

  if (!auth.isAuthenticated()) {
    return null;
  }

  const { id, nome, dataLogin } = auth.user;

  return (
    <Card size='small'>
      <Row gutter={[10, 5]}>
        <Col>
          <Cadastro id={id}>
            <Avatar size='large'
              icon={<UserOutlined />} />
          </Cadastro>
        </Col>
        <Col>
          <b>{nome}</b>
          <br />
          {dataLogin ? (
            <small>
              Login realizado em {format(new Date(dataLogin), 'dd/MM HH:mm')}
            </small>
          ) : ''}
        </Col>
      </Row>
    </Card>
  );
}
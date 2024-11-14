import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Avatar, Button, Card, Col, Row } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../../providers/AuthProvider';
import Cadastro from '../login/Cadastro';

export default function UsuarioLogado() {
  const navigate = useNavigate();
  const auth = useAuth();

  const logout = () => {
    auth.logout();
    navigate('/entrar');
  }

  if (!auth.isAuthenticated()) {
    return null;
  }

  const { id, nome, dataLogin } = auth.user;

  return (
    <Card size='small'>
      <Row gutter={[10, 5]}
        align='middle'>
        <Col xl={21}
          lg={20}
          md={18}
          sm={16}
          xs={24}>
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
        </Col>
        <Col xl={3}
          lg={4}
          md={6}
          sm={8}
          xs={24}>
          <Button danger
            block
            onClick={logout}
            icon={<LogoutOutlined />}>
            Sair
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
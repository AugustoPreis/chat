import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Col, Divider, Form, Input, message, notification, Row } from 'antd';
import { UnlockOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../providers/AuthProvider';
import Cadastro from './Cadastro';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const auth = useAuth();

  const handleSubmit = (values) => {
    const { usuario, senha } = values;

    if (!usuario?.trim() || !senha?.trim()) {
      return;
    }

    setLoading(true);

    auth
      .login({ usuario, senha })
      .then(() => {
        setLoading(false);
        message.success('Login realizado com sucesso!');
      }).catch((err) => {
        setLoading(false);
        notification.error({
          message: 'Erro!',
          description: err.message,
        });
      });
  }

  const title = (text) => {
    return (
      <b style={{ fontSize: 18, opacity: 0.8 }}>
        {text}
      </b>
    );
  }

  const preencherCampos = (values) => {
    form.setFieldsValue({
      usuario: values.login,
      senha: values.senha,
    });
  }

  if (auth.isAuthenticated()) {
    return (
      <Navigate to='/listagem-chats' />
    );
  }

  return (
    <Row justify='center'
      align='middle'
      style={{ height: '80vh' }}>
      <Col xl={7}
        lg={8}
        md={10}
        sm={14}
        xs={24}>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}>
          <Row gutter={[10, 5]}
            justify='center'
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '5px 20px 20px 20px',
            }}>
            <Col span={24}
              style={{ textAlign: 'center', fontSize: 40, opacity: 0.8 }}>
              <b>Chat</b>
            </Col>
            <Divider />
            <Col span={24}
              style={{ marginTop: 30 }}>
              {title('Nome de Usuário')}
            </Col>
            <Col span={24}>
              <Form.Item noStyle
                name='usuario'
                rules={[{ required: true }]}>
                <Input size='large'
                  placeholder='Informe o nome de usuário'
                  prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={24}
              style={{ marginTop: 40 }}>
              {title('Senha')}
            </Col>
            <Col span={24}>
              <Form.Item noStyle
                name='senha'
                rules={[{ required: true }]}>
                <Input.Password size='large'
                  placeholder='Informe a senha'
                  onPressEnter={form.submit}
                  prefix={<UnlockOutlined />} />
              </Form.Item>
            </Col>
            <Col xl={8}
              lg={9}
              md={8}
              sm={7}
              xs={24}
              style={{ marginTop: 20 }}>
              <Button block
                size='large'
                type='primary'
                loading={loading}
                onClick={form.submit}>
                Entrar
              </Button>
            </Col>
            <Col span={24}
              style={{ marginTop: 10 }}>
              <Cadastro onClose={preencherCampos}>
                Não possui uma conta? <a>Cadastre-se</a>
              </Cadastro>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
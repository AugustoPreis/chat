import React from 'react';
import { Button, Col, Row } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useChatContext } from './context/ChatContext';

export default function Cabecalho() {
  const { chat, sair } = useChatContext();

  return (
    <Row justify='space-between'>
      <Col style={{ fontSize: 20 }}>
        {chat.nome}
      </Col>
      <Col>
        <Button type='primary'
          icon={<LogoutOutlined />}
          onClick={sair}>
          Sair
        </Button>
      </Col>
    </Row>
  );
}
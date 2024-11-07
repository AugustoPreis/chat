import React, { useState } from 'react';
import { Button, Col, Input, Row } from 'antd';
import { useChatContext } from './context/ChatContext';

export default function Rodape() {
  const [mensagem, setMensagem] = useState('');
  const { enviarMensagem } = useChatContext();

  const handleSubmit = () => {
    if (mensagem?.trim() === '') {
      return;
    }

    enviarMensagem?.(mensagem);
    setMensagem('');
  }

  return (
    <Row gutter={[10, 5]}
      justify='space-between'>
      <Col xl={21}
        lg={20}
        md={18}
        sm={16}
        xs={24}>
        <Input size='large'
          maxLength={250}
          value={mensagem}
          onPressEnter={handleSubmit}
          onChange={(e) => setMensagem(e.target.value)} />
      </Col>
      <Col xl={3}
        lg={4}
        md={6}
        sm={8}
        xs={24}>
        <Button block
          size='large'
          type='primary'
          onClick={handleSubmit}
          disabled={mensagem?.trim() === ''}>
          Enviar
        </Button>
      </Col>
    </Row>
  );
}
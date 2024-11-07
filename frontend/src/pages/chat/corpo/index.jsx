import React, { useEffect, useRef } from 'react';
import { Col, Row } from 'antd';
import { useChatContext } from '../context/ChatContext';
import Mensagem from './Mensagem';

export default function Corpo() {
  const { mensagens } = useChatContext();
  const corpoRef = useRef();

  useEffect(() => {
    scrollFinal();
  }, [mensagens]);

  const scrollFinal = () => {
    if (corpoRef.current) {
      corpoRef.current.scrollTop = corpoRef.current.scrollHeight;
    }
  }

  return (
    <Row ref={corpoRef}
      style={{ height: '70vh', overflowY: 'auto', overflowX: 'hidden' }}>
      <Col span={24}
        style={{ height: '100%' }}>
        <Row gutter={[10, 10]}>
          {mensagens.map((mensagem) => (
            <Col key={mensagem.id}
              span={24}>
              <Mensagem mensagem={mensagem} />
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
}
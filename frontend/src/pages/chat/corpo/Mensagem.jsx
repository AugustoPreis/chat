import React from 'react';
import { Row, Col } from 'antd';
import { format } from 'date-fns';
import { useAuth } from '../../../providers/AuthProvider';

export default function Mensagem({ mensagem }) {
  const { descricao, usuario, dataCadastro } = mensagem;
  const auth = useAuth();
  const isMyMessage = usuario.id === auth.user?.id;

  return (
    <Row justify={isMyMessage ? 'end' : 'start'}>
      <Col style={{
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: isMyMessage ? '#f0f0f0' : '#e6f7ff',
      }}>
        <Row gutter={[5, 5]}>
          <Col span={24}>
            <b>{isMyMessage ? 'Você' : usuario.nome}</b>, {format(new Date(dataCadastro), "'em' dd/MM 'às' HH:mm")}
          </Col>
          <Col span={24}>
            {descricao}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
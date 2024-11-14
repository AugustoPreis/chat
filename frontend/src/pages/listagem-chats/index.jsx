import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Input, Row, Spin } from 'antd';
import { useAuth } from '../../providers/AuthProvider';
import request from '../../utils/request';
import { copiar } from '../../utils/copiar';
import { showError } from '../../utils/error';
import SalaPrivada from './SalaPrivada';
import Chat from './Chat';
import NovoChat from './NovoChat';

export default function ListagemChats() {
  const [filtro, setFiltro] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchChats();
    }, 350);

    return () => clearTimeout(timeout);
  }, [filtro]);

  const fetchChats = () => {
    setLoading(true);

    request('/chats', {
      method: 'GET',
      params: { filtro },
    }).then((chats) => {
      setLoading(false);
      setChats(chats);
    }).catch((erro) => {
      setLoading(false);
      showError(erro);
    });
  }

  const entrarChat = (id) => {
    navigate(`/chats/${id}`);
  }

  return (
    <Spin spinning={loading}>
      <Row gutter={[10, 5]}>
        <Col span={24}>
          <Card>
            <Row gutter={[10, 5]}>
              <Col xl={8}
                lg={10}
                xs={24}>
                <Input size='large'
                  value={filtro}
                  placeholder='Filtrar chats...'
                  onChange={(e) => setFiltro(e.target.value)} />
              </Col>
              <Col xl={{ span: 4, offset: 8 }}
                lg={{ span: 5, offset: 4 }}
                sm={12}
                xs={24}>
                <SalaPrivada onClose={(id) => entrarChat(id)}>
                  <Button block
                    size='large'>
                    Sala Privada
                  </Button>
                </SalaPrivada>
              </Col>
              <Col xl={4}
                lg={5}
                sm={12}
                xs={24}>
                <NovoChat onClose={(id) => entrarChat(id)}>
                  <Button block
                    size='large'
                    type='primary'>
                    Novo Chat
                  </Button>
                </NovoChat>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}
          style={{ marginTop: 10 }}>
          <Row gutter={[10, 10]}>
            {chats.map((chat) => (
              <Col key={chat.id}
                span={24}>
                <Chat data={chat}
                  copiarId={() => copiar(chat.id)}
                  entrar={() => entrarChat(chat.id)} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Spin>
  );
}
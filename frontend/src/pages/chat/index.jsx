import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Divider, Spin } from 'antd';
import request from '../../utils/request';
import { createSocket } from '../../utils/socket';
import { showError } from '../../utils/error';
import { ChatContext } from './context/ChatContext';
import Cabecalho from './Cabecalho';
import Rodape from './Rodape';
import Corpo from './corpo';

export default function Chat() {
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState({});
  const [mensagens, setMensagens] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const socketRef = useRef();

  useEffect(() => {
    if (!id || id.trim() === '') {
      return sairChat();
    }

    fetchChat();
  }, [id]);

  const fetchChat = () => {
    setLoading(true);

    request(`/chats/${id}`, {
      method: 'GET',
    }).then((chat) => {
      setLoading(false);
      eventos();
      setChat({ ...chat, id });
    }).catch((error) => {
      setLoading(false);
      showError(error);
    });
  }

  const eventos = () => {
    socketRef.current = createSocket({ chatId: id });

    window.addEventListener('unload', () => {
      socketRef.current.disconnect();
    });

    socketRef.current.connect();

    socketRef.current.on('mensagens-anteriores', (mensagens) => {
      setMensagens(mensagens);
    });

    socketRef.current.on('mensagem-recebida', (mensagem) => {
      setMensagens(old => [...old, mensagem]);
    });
  }

  const enviarMensagem = (mensagem) => {
    socketRef.current.emit('mensagem', mensagem);
  }

  const sairChat = () => {
    navigate('/listagem-chats');
  }

  return (
    <Spin spinning={loading}>
      <ChatContext.Provider value={{
        chat,
        mensagens,
        sair: sairChat,
        enviarMensagem,
      }}>
        <Card title={<Cabecalho />}>
          <Corpo />
          <Divider />
          <Rodape />
        </Card>
      </ChatContext.Provider>
    </Spin>
  );
}
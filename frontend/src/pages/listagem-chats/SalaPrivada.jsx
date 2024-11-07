import React, { useState } from 'react';
import { Row, Modal, message, Col, Input } from 'antd';

export default function SalaPrivada({ children, onClose }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState('');

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);
  }

  const handleSubmit = () => {
    if (typeof id != 'string' || id.trim() === '') {
      message.error('Informe um ID válido.');

      return;
    }

    onClose?.(id);
    handleClear();
  }

  const handleClear = () => {
    setId('');
    setLoading(false);
    setVisible(false);
  }

  return (
    <span>
      <span onClick={modal}
        style={{ cursor: 'pointer' }}>
        {children}
      </span>
      <Modal open={visible}
        title='Entrar em sala privada'
        okText='Entrar'
        centered
        destroyOnClose
        maskClosable={false}
        onCancel={handleClear}
        onOk={handleSubmit}>
        <Row gutter={[10, 5]}>
          <Col span={24}
            style={{ padding: '25px 0px' }}>
            <Input size='large'
              value={id}
              placeholder='ID da sala'
              onChange={(e) => setId(e.target.value)} />
          </Col>
        </Row>
      </Modal>
    </span>
  );
}
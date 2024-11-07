import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Checkbox, Input, InputNumber, Col } from 'antd';
import request from '../../utils/request';
import { showError } from '../../utils/error';

export default function NovoChat({ children, onClose }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);
  }

  const handleSubmit = (values) => {
    setLoading(true);

    request('/chats', {
      method: 'POST',
      body: values,
    }).then((chat) => {
      setLoading(false);
      onClose?.(chat.id);
      handleClear();
    }).catch((error) => {
      setLoading(false);
      showError(error);
    });
  }

  const handleClear = () => {
    form.resetFields();
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
        title='Cadastrar Novo Chat'
        okText='Cadastrar'
        centered
        destroyOnClose
        onCancel={handleClear}
        onOk={form.submit}>
        <Form form={form}
          layout='vertical'
          initialValues={{ qtdMaximaUsuarios: 10 }}
          onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]}>
              <Col span={24}>
                <Form.Item name='nome'
                  label='Nome do Chat'
                  rules={[{ required: true, message: '' }]}>
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
              <Col sm={12}
                xs={24}>
                <Form.Item name='qtdMaximaUsuarios'
                  label='Qtd. Máxima Usuários'
                  rules={[{ required: true, message: '' }]}>
                  <InputNumber min={2}
                    max={100}
                    precision={0}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item noStyle
                  name='privado'
                  valuePropName='checked'>
                  <Checkbox>
                    Chat Privado
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}
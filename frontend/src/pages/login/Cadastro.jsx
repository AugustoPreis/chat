import React, { useState } from 'react';
import { Row, Modal, Form, Spin, Input, Col } from 'antd';
import request from '../../utils/request';
import { showError } from '../../utils/error';

export default function Cadastro({ id, children, onClose }) {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const modal = (e) => {
    e.stopPropagation();
    setVisible(true);

    if (id) {
      fetchData();
    }
  }

  const fetchData = () => {
    if (!id) {
      return;
    }

    setLoading(true);

    request(`/usuarios/${id}`, {
      method: 'GET',
    }).then((data) => {
      setLoading(false);
      form.setFieldsValue(data);
    }).catch((err) => {
      setLoading(false);
      showError(err);
    });
  }

  const handleSubmit = (values) => {
    setLoading(true);

    const context = {
      url: '/cadastro',
      method: 'POST',
      auth: false,
    }

    if (id) {
      context.url = `/usuarios/${id}`;
      context.method = 'PUT';
      context.auth = true;
    }

    request(context.url, {
      method: context.method,
      auth: context.auth,
      body: values,
    }).then(() => {
      setLoading(false);
      handleClear();
      onClose?.(values);
    }).catch((err) => {
      setLoading(false);
      showError(err);
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
        title='Cadastro de Usuário'
        okText='Salvar'
        centered
        width={650}
        destroyOnClose
        onCancel={handleClear}
        onOk={form.submit}>
        <Form form={form}
          layout='vertical'
          onFinish={handleSubmit}>
          <Spin spinning={loading}>
            <Row gutter={[10, 5]}>
              <Col span={24}>
                <Form.Item name='nome'
                  label='Nome'
                  rules={[{ required: true }]}>
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
              <Col sm={12}
                xs={24}>
                <Form.Item name='login'
                  label='Login'
                  rules={[{ required: true }]}>
                  <Input maxLength={100} />
                </Form.Item>
              </Col>
              <Col sm={12}
                xs={24}>
                <Form.Item name='senha'
                  label='Senha'
                  rules={[{ required: !id }]}>
                  <Input.Password maxLength={50} />
                </Form.Item>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </span>
  );
}
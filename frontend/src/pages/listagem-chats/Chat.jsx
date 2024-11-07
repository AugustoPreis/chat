import React from 'react';
import { Button, Card, Col, Row } from 'antd';
import { ArrowRightOutlined, CopyTwoTone } from '@ant-design/icons';

export default function Chat({ data, copiarId, entrar }) {
  const { nome, qtdMaximaUsuarios, qtdAtualUsuarios } = data;

  return (
    <Card>
      <Row gutter={[10, 5]}
        align='middle'>
        <Col lg={21}
          md={20}
          sm={19}
          xs={24}>
          <Row gutter={[10, 5]}>
            <Col span={24}
              style={{ fontSize: 20 }}>
              {nome}
            </Col>
            <Col span={24}>
              {qtdAtualUsuarios}/{qtdMaximaUsuarios}
            </Col>
          </Row>
        </Col>
        <Col lg={3}
          md={4}
          sm={5}
          xs={24}>
          <Row gutter={[10, 5]}
            justify='end'>
            <Col>
              <Button size='large'
                onClick={copiarId}
                icon={<CopyTwoTone />} />
            </Col>
            <Col>
              <Button size='large'
                type='primary'
                onClick={entrar}
                icon={<ArrowRightOutlined />} />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
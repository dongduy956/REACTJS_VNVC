import { Button, Col, Form, Input, notification, Row, Spin } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { permissionService } from '~/services';
const Add = () => {
    useAuth();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const fetchData = async (params) => {
        setLoading(true);
        const res = await permissionService.insertPermission(params);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi thêm chức vụ.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.permission);
            notification.success({
                message: 'Thành công',
                description: res.messages[0],
                duration: 3,
            });
        } else
            notification.error({
                message: 'Lỗi',
                description: res.messages[0],
                duration: 3,
            });
        setLoading(false);
    };
    const onFinish = (params) => fetchData(params);
    return (
        <>
            <Head title={`${configTitle.add} ${configTitle.permission.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm chức vụ</TitleAddUpdate>
                    <Col span={24}>
                        <Form
                            name="wrap"
                            labelCol={{
                                flex: '110px',
                            }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{
                                flex: 1,
                            }}
                            colon={false}
                            onFinish={onFinish}
                        >
                            <Row gutter={[16, 0]}>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        labelCol={{ span: 7 }}
                                        label="Tên chức vụ"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ tên chức vụ.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item>
                                        <Link to={configRoutes.permission}>
                                            <Button type="dashed">Trở lại</Button>
                                        </Link>
                                        <Button className="ml-2" type="primary" htmlType="submit">
                                            Thêm
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Spin>
        </>
    );
};
export default Add;

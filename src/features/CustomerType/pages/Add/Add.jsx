import { Breadcrumb, Button, Col, Form, Input, Row, Spin, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { customerTypeService } from '~/services';
const Add = () => {
    useAuth();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const fetchData = async (params) => {
        setLoading(true);
        const res = await customerTypeService.insertCustomerType(params);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi thêm loại khách hàng',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.customerType);
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
            <Head title={`${configTitle.add} ${configTitle.customerType.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm loại khách hàng</TitleAddUpdate>
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
                                        label="Tên loại khách hàng"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ họ và tên',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        labelCol={{ span: 7 }}
                                        label="Độ tuổi"
                                        name="age"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập độ tuổi.',
                                            },
                                            {
                                                validator: (rule, value, cb) => {
                                                    value <= 0 ? cb('Độ tuổi không được nhỏ hơn hoặc bằng 0.') : cb();
                                                },
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item>
                                        <Link to={configRoutes.customerType}>
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

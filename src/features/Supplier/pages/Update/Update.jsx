import { Button, Col, Form, Input, notification, Row, Spin } from 'antd';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { supplierService } from '~/services';
import { validate } from '~/utils';
const Update = () => {
    useAuth();
    const { state } = useLocation();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const fetchData = async (params) => {
        setLoading(true);
        const res = await supplierService.updateSupplier(state.id, params);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi sửa nhà cung cấp.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.supplier);
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
            <Head title={`${configTitle.update} ${configTitle.supplier.toLowerCase()} ${state.name}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Sửa nhà cung cấp {state.name}</TitleAddUpdate>
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
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.name}
                                        label="Tên nhà cung cấp"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ tên nhà cung cấp.',
                                            },
                                        ]}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.address}
                                        label="Địa chỉ"
                                        name="address"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ địa chỉ.',
                                            },
                                        ]}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Số điện thoại"
                                        initialValue={state.phoneNumber}
                                        name="phoneNumber"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ số điện thoại.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    validate.isPhoneNumber(value) === true
                                                        ? cb()
                                                        : cb('Số điện thoại không đúng định dạng.'),
                                                message: 'Số điện thoại không đúng định dạng.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Tax code"
                                        initialValue={state.taxCode}
                                        name="taxCode"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ tax code.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="E-mail"
                                        initialValue={state.email}
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ E-mail.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    validate.isEmail(value) === true
                                                        ? cb()
                                                        : cb('E-mail không đúng định dạng'),
                                                message: 'E-mail không đúng định dạng',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label=" ">
                                        <Link to={configRoutes.supplier}>
                                            <Button type="dashed">Trở lại</Button>
                                        </Link>
                                        <Button className="ml-2" type="primary" htmlType="submit">
                                            Sửa
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
export default Update;

import { Button, Col, Form, Input, notification, Row, Spin } from 'antd';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { regulationInjectionService } from '~/services';
const Update = () => {
    useAuth();
    const { state } = useLocation();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);

    const fetchData = async (params) => {
        setLoading(true);
        const res = await regulationInjectionService.updateRegulationInjection(state.id, params);
        setLoading(false);

        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi sửa quy định tiêm.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.regulationInjection);
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
    };
    const onFinish = (params) => {
        params.vaccineId = state.vaccineId;
        fetchData(params);
    };
    return (
        <>
            <Head title={`${configTitle.update} ${configTitle.regulationInjection.toLowerCase()} ${state.id}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Sửa quy định tiêm</TitleAddUpdate>
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
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={state.vaccineName}
                                        label="Vaccine"
                                        name="vaccineId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={state.distance}
                                        label="Khoảng cách"
                                        name="distance"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập khoảng cách.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value < 0 ? cb('Khoảng cách tiêm phải lớn hoặc bằng 0.') : cb(),
                                                message: 'Khoảng cách tiêm phải lớn hoặc bằng 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={state.repeatInjection}
                                        label="Tiêm nhắc lại"
                                        name="repeatInjection"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập tiêm nhắc lại.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value < -1 || value > 0
                                                        ? cb('Chỉ nhận 2 giá trị (0: không, -1: có).')
                                                        : cb(),
                                                message: 'Chỉ nhận 2 giá trị (0: không, -1: có).',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={state.order}
                                        label="thứ tự tiêm"
                                        name="order"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập thứ tự tiêm.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Thứ tự tiêm phải lớn hơn 0.') : cb(),
                                                message: 'Thứ tự tiêm phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label=" ">
                                        <Link to={configRoutes.regulationInjection}>
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

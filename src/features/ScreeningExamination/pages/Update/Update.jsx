import { Button, Checkbox, Col, Form, Input, notification, Row, Spin } from 'antd';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configStorage, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { screeningExaminationService } from '~/services';
const Update = () => {
    useAuth();
    const [form] = Form.useForm();
    const { state } = useLocation();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);    
    const [checkedIsEligible, setCheckedIsEligible] = useState(state.isEligible);   
    const fetchData = async (params) => {
        setLoading(true);
        const res = await screeningExaminationService.updateScreeningExamination(state.id, params);
        setLoading(false);

        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi sửa phiếu khám.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.screeningExamination);
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
        params.isEligible = checkedIsEligible;
        params.customerId = state.customerId;
        params.staffId= JSON.parse(Cookies.get(configStorage.login)).user.staffId;
        fetchData(params);
    };
    const handleIsEligible = (e) => {
        setCheckedIsEligible(e.target.checked);
    };
  
    return (
        <>           
            <Head title={`${configTitle.update} ${configTitle.screeningExamination.toLowerCase()} ${state.id}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Sửa phiếu khám</TitleAddUpdate>
                    <Col span={24}>
                        <Form
                            form={form}
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
                                        initialValue={state.customerName}
                                        label="Khách hàng"
                                        name="customerId"
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
                                        initialValue={state.diagnostic}
                                        label="Chuẩn đoán"
                                        name="diagnostic"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập chuẩn đoán.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={state.height}
                                        label="Chiều cao"
                                        name="height"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập chiều cao.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Chiều cao phải lớn hơn 0.') : cb(),
                                                message: 'Chiều cao phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={state.weight}
                                        label="Cân nặng"
                                        name="weight"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập cân nặng.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Cân nặng phải lớn hơn 0.') : cb(),
                                                message: 'Cân nặng phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={state.temperature}
                                        label="Nhiệt độ"
                                        name="temperature"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập nhiệt độ.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Nhiệt độ phải lớn hơn 0.') : cb(),
                                                message: 'Nhiệt độ phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={state.heartbeat}
                                        label="Nhịp tim"
                                        name="heartbeat"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập nhịp tim.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Nhip tim phải lớn hơn 0.') : cb(),
                                                message: 'Nhip tim phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={state.bloodPressure}
                                        label="Huyết áp"
                                        name="bloodPressure"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập huyết áp.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Huyết áp phải lớn hơn 0.') : cb(),
                                                message: 'Huyết áp phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item label="Đủ điều kiện" name="isEligible">
                                        <Checkbox checked={checkedIsEligible} onChange={handleIsEligible} />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item initialValue={state.note} label="Ghi chú" name="note">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label=" ">
                                        <Link to={configRoutes.screeningExamination}>
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

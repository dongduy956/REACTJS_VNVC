import { Button, Col, DatePicker, Form, Input, notification, Row, Spin } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { defaultUTC } from '~/constraints';
import { useAuth } from '~/hooks';
import { promotionService } from '~/services';
const { RangePicker } = DatePicker;
const Update = () => {
    useAuth();
    const { state } = useLocation();
    const history = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const fetchData = async (params) => {
        setLoading(true);
        const res = await promotionService.updatePromotion(state.id, params);
        setLoading(false);

        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi sửa khuyến mãi.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.promotion);
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
        let startDate = new Date(params.dates[0].format());
        startDate = new Date(startDate.setHours(startDate.getHours() + defaultUTC.hours)).toISOString();
        let endDate = new Date(params.dates[1].format());
        endDate = new Date(endDate.setHours(endDate.getHours() + defaultUTC.hours)).toISOString();
        params.startDate = startDate;
        params.endDate = endDate;
        params.discount = Number(params.discount) / 100;
        delete params.dates;
        fetchData(params);
    };
    return (
        <>
            <Head title={`${configTitle.update} ${configTitle.promotion.toLowerCase()} ${state.promotionCode}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Sửa khuyến mãi {state.promotionCode}</TitleAddUpdate>
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
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.promotionCode}
                                        label="Mã khuyến mãi"
                                        name="promotionCode"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.discount * 100}
                                        label="Giảm giá"
                                        name="discount"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn giảm giá',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 || value > 100 ? cb('Mã giảm giá từ 1 - 100%') : cb(),
                                                message: 'Mã giảm giá từ 1 - 100%',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={state.count}
                                        label="Số lượt dùng"
                                        name="count"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập số lượt dùng.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    !(value > 0 || value < 0)
                                                        ? cb('Số lượt dùng lớn hơn 0 và nhỏ hơn tổng lượng dùng.')
                                                        : cb(),
                                                message: 'Số lượt dùng lớn hơn 0 và nhỏ hơn tổng lượng dùng.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={[
                                            moment(new Date(state.startDate), 'dd/MM/yyyy'),
                                            moment(new Date(state.endDate), 'dd/MM/yyyy'),
                                        ]}
                                        name="dates"
                                        label="Ngày"
                                        rules={[
                                            {
                                                type: 'array',
                                                required: true,
                                                message: 'Vui lòng chọn ngày!',
                                            },
                                        ]}
                                    >
                                        <RangePicker
                                        showTime
                                            className="w-full"
                                            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label=" ">
                                        <Link to={configRoutes.promotion}>
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

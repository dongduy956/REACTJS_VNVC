import { Button, Col, DatePicker, Form, Input, notification, Row, Spin } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { defaultUTC } from '~/constraints';
import { useAuth } from '~/hooks';
import { promotionService } from '~/services';
const Add = () => {
    const { RangePicker } = DatePicker;
    useAuth();
    const history = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const fetchData = async (params) => {
        setLoading(true);
        const promotions = (await promotionService.getAllPromotions()).data;
        if (promotions.find((x) => x.promotionCode.toLowerCase().trim() === params.promotionCode.toLowerCase().trim()))
            notification.warning({
                message: 'Cảnh báo',
                description: 'Đã có mã khuyến mãi này rồi.',
                duration: 3,
            });
        else {
            const res = await promotionService.insertPromotion(params);
            if (res.status === 500)
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi thêm khuyến mãi.',
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
        }
        setLoading(false);
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
            <Head title={`${configTitle.add} ${configTitle.promotion.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm khuyến mãi</TitleAddUpdate>
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
                                        label="Mã khuyến mãi"
                                        name="promotionCode"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ mã khuyến mãi.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        label="Giảm giá"
                                        name="discount"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập giảm giá',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 || value > 100 ? cb('Mã giảm giá từ 1 - 100%') : cb(),
                                                message: 'Mã giảm giá từ 1 - 100%',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
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
                                                        ? cb('Số lượt dùng lớn hơn 0 hoặc bằng -1(không giới hạn).')
                                                        : cb(),
                                                message: 'Số lượt dùng lớn hơn 0 hoặc bằng -1(không giới hạn).',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={[
                                            moment(new Date(), 'dd/MM/yyyy'),
                                            moment(new Date(), 'dd/MM/yyyy'),
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

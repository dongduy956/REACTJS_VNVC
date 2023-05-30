import { Button, Col, DatePicker, Form, Input, notification, Row, Spin } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { defaultUTC } from '~/constraints';
import { shipmentService } from '~/services';
const { RangePicker } = DatePicker;
const Update = () => {
    const [form] = Form.useForm();
    const { state } = useLocation();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);

    const fetchData = async (params) => {
        setLoading(true);
        const res = await shipmentService.updateShipment(state.id, params);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi sửa lô hàng.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.shipment);
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
    const onFinish = (params) => {
        let manufactureDate = new Date(params.dates[0].format());
        manufactureDate = new Date(
            manufactureDate.setHours(manufactureDate.getHours() + defaultUTC.hours),
        ).toISOString();
        let expirationDate = new Date(params.dates[1].format());
        expirationDate = new Date(expirationDate.setHours(expirationDate.getHours() + defaultUTC.hours)).toISOString();
        delete params.dates;
        fetchData({
            manufactureDate,
            expirationDate,
        });
    };

    return (
        <>
            <Head title={`${configTitle.update} ${configTitle.shipment.toLowerCase()} ${state.shipmentCode}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Sửa lô vaccine {state.name}</TitleAddUpdate>
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
                                        rules={[{ required: true }]}
                                        initialValue={state.shipmentCode}
                                        label="Mã lô"
                                        name="shipmentCode"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        rules={[{ required: true }]}
                                        initialValue={state.supplierName}
                                        label="Nhà cung cấp"
                                        name="supplierId"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        rules={[{ required: true }]}
                                        initialValue={state.vaccineName}
                                        label="Vaccine"
                                        name="vaccineId"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={[
                                            moment(new Date(state.manufactureDate), 'dd/MM/yyyy'),
                                            moment(new Date(state.expirationDate), 'dd/MM/yyyy'),
                                        ]}
                                        name="dates"
                                        label="Ngày"
                                        rules={[
                                            {
                                                type: 'array',
                                                required: true,
                                                message: 'Vui lòng chọn ngày!',
                                            },
                                            {
                                                validator: (rule, values, cb) =>
                                                    new Date(values[0].format()) >= new Date()
                                                        ? cb('Ngày sản xuất không được lớn hơn ngày hiện tại.')
                                                        : cb(),
                                                message: 'Ngày sản xuất không được lớn hơn ngày hiện tại.',
                                            },
                                        ]}
                                    >
                                        <RangePicker
                                            showTime
                                            className="w-full"
                                            placeholder={['Ngày sản xuất', 'Ngày hết hạn']}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        rules={[{ required: true }]}
                                        initialValue={state.country}
                                        name="country"
                                        label="Quốc gia"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="">
                                        <Link to={configRoutes.shipment}>
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

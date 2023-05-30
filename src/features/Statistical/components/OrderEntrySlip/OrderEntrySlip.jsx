import { Col, Form, Row, Select, Spin } from 'antd';
import { useState } from 'react';
import { typeStatistical } from '~/constraints';
import OrderEntrySlipByDate from './OrderEntrySlipByDate';
import OrderEntrySlipByYear from './OrderEntrySlipByYear';
import OrderEntrySlipQuarterOfYear from './OrderEntrySlipQuarterOfYear';
import OrderEntrySlipOther from './OrderEntrySlipOther';
import OrderEntrySlipEachMonthOfYear from './OrderEntrySlipEachMonthOfYear';
import OrderEntrySlipByMonth from './OrderEntrySlipByMonth';

const OrderEntrySlip = () => {
    const { byDate, byYear, eachMonthOfYear, quarterOfYear, other, byMonth } = typeStatistical;
    const typeOrderEntrySlips = [
        {
            id: byDate,
            name: 'Theo ngày',
        },
        {
            id: byMonth,
            name: 'Theo tháng',
        },
        {
            id: byYear,
            name: 'Theo năm',
        },

        {
            id: eachMonthOfYear,
            name: 'Các tháng trong năm',
        },
        {
            id: quarterOfYear,
            name: 'Các quý trong năm',
        },
        {
            id: other,
            name: 'Khác',
        },
    ];
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [typeOrderEntrySlip, setTypeOrderEntrySlip] = useState();
    const handleSelectType = (value) => {
        setLoading(true);
        switch (value) {
            case byDate:
                setTypeOrderEntrySlip({
                    component: <OrderEntrySlipByDate form={form} setLoading={setLoading} />,
                });
                break;
            case byMonth:
                setTypeOrderEntrySlip({ component: <OrderEntrySlipByMonth form={form} setLoading={setLoading} /> });
                break;
            case byYear:
                setTypeOrderEntrySlip({ component: <OrderEntrySlipByYear form={form} setLoading={setLoading} /> });
                break;
            case eachMonthOfYear:
                setTypeOrderEntrySlip({
                    component: <OrderEntrySlipEachMonthOfYear form={form} setLoading={setLoading} />,
                });
                break;
            case quarterOfYear:
                setTypeOrderEntrySlip({
                    component: <OrderEntrySlipQuarterOfYear form={form} setLoading={setLoading} />,
                });
                break;
            case other:
                setTypeOrderEntrySlip({ component: <OrderEntrySlipOther form={form} setLoading={setLoading} /> });
                break;
            default:
                setTypeOrderEntrySlip(null);
        }
        setLoading(false);
    };
    return (
        <Spin spinning={loading} tip="Loading...">
            <Form
                form={form}
                name="wrap"
                labelAlign="right"
                labelWrap
                wrapperCol={{
                    flex: 1,
                }}
                colon={false}
                // onFinish={onFinish}
            >
                <Row gutter={[16, 16]}>
                    <Col span={24} md={{ span: 12 }}>
                        <Form.Item
                            label="Chọn loại thống kê"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                },
                                {
                                    validator: (rule, value, cb) =>
                                        value <= -1 ? cb('Vui lòng chọn loại thống kê') : cb(),
                                    message: 'Vui lòng chọn loại thống kê',
                                },
                            ]}
                            initialValue={-1}
                        >
                            <Select onChange={handleSelectType}>
                                <Select.Option value={-1}>Chọn loại thống kê</Select.Option>
                                {typeOrderEntrySlips.map((item) => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {typeOrderEntrySlip && typeOrderEntrySlip.component}
                </Row>
            </Form>
        </Spin>
    );
};

export default OrderEntrySlip;

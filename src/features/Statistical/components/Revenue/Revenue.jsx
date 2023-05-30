import { Col, Form, Row, Select, Spin } from 'antd';
import { useState } from 'react';
import { typeStatistical } from '~/constraints';
import RevenueByDate from './RevenueByDate';
import RevenueByYear from './RevenueByYear';
import RevenueQuarterOfYear from './RevenueQuarterOfYear';
import RevenueOther from './RevenueOther';
import RevenueEachMonthOfYear from './RevenueEachMonthOfYear';
import RevenueByMonth from './RevenueByMonth';

const Revenue = () => {
    const { byDate, byYear, eachMonthOfYear, quarterOfYear, other, byMonth } = typeStatistical;
    const typeRevenues = [
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
    const [typeRevenue, setTypeRevenue] = useState();
    const handleSelectType = (value) => {
        setLoading(true);
        switch (value) {
            case byDate:
                setTypeRevenue({
                    component: <RevenueByDate form={form} setLoading={setLoading} />,
                });
                break;
            case byMonth:
                setTypeRevenue({ component: <RevenueByMonth form={form} setLoading={setLoading} /> });
                break;
            case byYear:
                setTypeRevenue({ component: <RevenueByYear form={form} setLoading={setLoading} /> });
                break;
            case eachMonthOfYear:
                setTypeRevenue({ component: <RevenueEachMonthOfYear form={form} setLoading={setLoading} /> });
                break;
            case quarterOfYear:
                setTypeRevenue({ component: <RevenueQuarterOfYear form={form} setLoading={setLoading} /> });
                break;
            case other:
                setTypeRevenue({ component: <RevenueOther form={form} setLoading={setLoading} /> });
                break;
            default:
                setTypeRevenue(null);
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
                                {typeRevenues.map((item) => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {typeRevenue && typeRevenue.component}
                </Row>
            </Form>
        </Spin>
    );
};

export default Revenue;

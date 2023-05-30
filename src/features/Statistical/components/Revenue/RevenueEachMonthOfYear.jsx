import { DualAxes } from '@ant-design/plots';
import { Col, Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import { statisticalService } from '~/services';
import { stringLibrary } from '~/utils';
const RevenueEachMonthOfYear = ({ form, setLoading }) => {
    const [data, setData] = useState([]);
    const [years, setYears] = useState([]);
    const fetchData = async (year) => {
        setLoading(true);
        if (year > 0) {
            const result = (await statisticalService.getRevenuesEachMonthOfYear(year)).data;
            setData(result.map((item) => ({ ...item, month: `T${item.month}/${year}` })));
        }
        setLoading(false);
    };
    useEffect(() => {
        (async () => {
            await fetchData(form.getFieldValue('year'));
            const year = new Date().getFullYear();
            const arr = [];
            for (let i = 1950; i <= year; i++) arr.push(i);
            setYears(arr.sort((a, b) => b - a));
        })();
        return () => {
            form.setFieldsValue({
                year: 0,
            });
        };
    }, []);
    const handleYear = async (year) => {
        await fetchData(year);
    };
    const config = {
        data: [data, data],
        xField: 'month',
        yField: ['totalPay', 'totalEntrySlip'],
        meta: {
            totalPay: {
                alias: 'Doanh thu',
                formatter: (value) => stringLibrary.formatMoney(value),
            },
            totalEntrySlip: {
                alias: 'Tổng chi',
                formatter: (value) => stringLibrary.formatMoney(value),
            },
        },
        geometryOptions: [
            {
                geometry: 'column',
            },
            {
                geometry: 'line',
                lineStyle: {
                    lineWidth: 2,
                },
            },
        ],
    };
    return (
        <>
            <Col span={24} md={{ span: 12 }}>
                <Form.Item
                    label="Chọn năm thống kê"
                    name="year"
                    rules={[
                        {
                            required: true,
                        },
                        {
                            validator: (rule, value, cb) => (value <= 0 ? cb('Vui lòng chọn năm thống kê') : cb()),
                            message: 'Vui lòng chọn năm thống kê',
                        },
                    ]}
                    initialValue={0}
                >
                    <Select onChange={handleYear}>
                        <Select.Option value={0}>Chọn năm thống kê</Select.Option>
                        {years.map((year) => (
                            <Select.Option key={year} value={year}>
                                {year}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col span={24}>
                <DualAxes {...config} />
            </Col>
        </>
    );
};

export default RevenueEachMonthOfYear;

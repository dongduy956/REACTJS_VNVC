import React, { useState, useEffect } from 'react';
import { Col, Form, Select } from 'antd';
import { Pie } from '@ant-design/plots';
import { statisticalService } from '~/services';
import { stringLibrary } from '~/utils';

const RevenueByMonth = ({ form, setLoading }) => {
    const [data, setData] = useState([]);
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const fetchData = async (month, year) => {
        setLoading(true);

        if (month > 0 && year > 0) {
            const result = (await statisticalService.getRevenueByMonth(month, year)).data;
            setData([
                {
                    type: 'Doanh thu',
                    value: result.totalPay,
                },
                {
                    type: 'Tổng chi',
                    value: result.totalEntrySlip,
                },
            ]);
        }
        setLoading(false);
    };
    useEffect(() => {
        (async () => {
            await fetchData(form.getFieldValue('month'), form.getFieldValue('year'));
            const year = new Date().getFullYear();
            const arrYear = [];
            const arrMonth = [];
            for (let i = 1950; i <= year; i++) arrYear.push(i);
            for (let i = 1; i < 13; i++) arrMonth.push(i);
            setYears(arrYear.sort((a, b) => b - a));
            setMonths(arrMonth);
        })();
        return () => {
            form.setFieldsValue({
                year: 0,
            });
        };
    }, []);
    const handleYear = async (year) => {
        if (form.getFieldValue('month') !== 0) await fetchData(form.getFieldValue('month'), year);
    };
    const handleMonth = async (month) => {
        if (form.getFieldValue('year') !== 0) await fetchData(month, form.getFieldValue('year'));
    };

    const config = {
        appendPadding: 10,
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        legend: { position: 'top' },
        tooltip: {
            formatter: (datum) => {
                return { name: datum.type, value: stringLibrary.formatMoney(datum.value) };
            },
        },
        label: {
            type: 'inner',
            offset: '-50%',
            content: (value) => stringLibrary.formatMoney(value.value),
            style: {
                textAlign: 'center',
                fontSize: 14,
            },
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
        statistic: {
            title: false,
            content: {
                style: {
                    whiteSpace: 'pre-wrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: 25,
                },
                content: 'Theo tháng',
            },
        },
    };
    return (
        <>
            <Col span={24} md={{ span: 12 }}></Col>
            <Col span={24} md={{ span: 12 }}>
                <Form.Item
                    label="Chọn tháng thống kê"
                    name="month"
                    rules={[
                        {
                            required: true,
                        },
                        {
                            validator: (rule, value, cb) => (value <= 0 ? cb('Vui lòng chọn tháng thống kê') : cb()),
                            message: 'Vui lòng chọn tháng thống kê',
                        },
                    ]}
                    initialValue={0}
                >
                    <Select onChange={handleMonth}>
                        <Select.Option value={0}>Chọn tháng thống kê</Select.Option>
                        {months.map((month) => (
                            <Select.Option key={month} value={month}>
                                {month}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
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
                <Pie {...config} />
            </Col>
        </>
    );
};

export default RevenueByMonth;

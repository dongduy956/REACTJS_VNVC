import React, { useState, useEffect } from 'react';
import { Col, Form, Select } from 'antd';
import { Pie } from '@ant-design/plots';
import { statisticalService } from '~/services';
import { stringLibrary } from '~/utils';

const RevenueByYear = ({ form, setLoading }) => {
    const [data, setData] = useState([]);
    const [years, setYears] = useState([]);
    const fetchData = async (year) => {
        setLoading(true);
        if (year > 0) {
            const result = (await statisticalService.getRevenueByYear(year)).data;
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
                content: 'Theo năm',
            },
        },
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
                <Pie {...config} />
            </Col>
        </>
    );
};

export default RevenueByYear;

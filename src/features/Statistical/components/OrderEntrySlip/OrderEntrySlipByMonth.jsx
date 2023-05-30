import React, { useState, useEffect } from 'react';
import { Col, Form, Select } from 'antd';
import { DualAxes, Pie } from '@ant-design/plots';
import { statisticalService } from '~/services';
import { stringLibrary } from '~/utils';

const style = {
    boxShadow: '0 12px 32px 0 rgba(0,0,0,0.12)',
    border: '1px solid rgba(63,67,80,0.08)',
};

const className = 'rounded-lg p-10 bg-white';

const OrderEntrySlipByMonth = ({ form, setLoading }) => {
    const [dataPie, setDataPie] = useState([]);
    const [dataDualAExes, setDataDualAExes] = useState([]);
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const fetchData = async (month, year) => {
        setLoading(true);
        if (month > 0 && year > 0) {
            const resultPie = (await statisticalService.getOrderEntrySlipByMonth(month, year)).data;
            setDataPie([
                {
                    type: 'Tổng đặt',
                    value: resultPie.totalOrder,
                },
                {
                    type: 'Tổng nhập',
                    value: resultPie.totalEntrySlip,
                },
            ]);
            const result = (await statisticalService.getEntrySlipsOfMonthByOrder(month, year)).data;
            setDataDualAExes(result.map((item) => ({ ...item, orderId: `Order-${item.orderId}` })));
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

    const configPie = {
        appendPadding: 10,
        data: dataPie,
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
    const configDualAxes = {
        data: [dataDualAExes, dataDualAExes],
        xField: 'orderId',
        yField: ['totalOrder', 'totalEntrySlip'],
        meta: {
            totalOrder: {
                alias: 'Tổng đặt',
                formatter: (value) => stringLibrary.formatMoney(value),
            },
            totalEntrySlip: {
                alias: 'Tổng nhập',
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
            <Col sm={{ span: 8 }} span={24}>
                <div style={style} className={className}>
                    <Pie {...configPie} />
                    <h5 className="text-center">Biểu đồ đơn đặt - phiếu nhập theo tháng</h5>
                </div>
            </Col>
            <Col sm={{ span: 16 }} span={24}>
                <div style={style} className={className}>
                    <DualAxes {...configDualAxes} />
                    <h5 className="text-center">Biểu đồ các phiếu nhập theo đơn đặt trong tháng</h5>
                </div>
            </Col>
        </>
    );
};

export default OrderEntrySlipByMonth;

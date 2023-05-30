import React, { useState, useEffect } from 'react';
import { Col, DatePicker, Form } from 'antd';
import moment from 'moment';
import { Pie } from '@ant-design/plots';
import { statisticalService } from '~/services';
import { stringLibrary } from '~/utils';
import { defaultUTC } from '~/constraints';
const RevenueByDate = ({ form, setLoading }) => {
    const [data, setData] = useState([]);
    const fetchData = async (date) => {
        setLoading(true);

        const result = (await statisticalService.getRevenueByDate(date)).data;
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
        setLoading(false);
    };
    useEffect(() => {
        (async () => {
            let date = new Date(form.getFieldValue('date').format());
            date = new Date(date.setHours(date.getHours() + defaultUTC.hours)).toISOString();
            await fetchData(date);
        })();
    }, []);
    const handleDate = async (date) => {
        await fetchData(new Date(date.format()));
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
                content: 'Theo ngày',
            },
        },
    };
    return (
        <>
            <Col span={24} md={{ span: 12 }}>
                <Form.Item
                    initialValue={moment(new Date(), 'dd/MM/yyyy')}
                    label="Chọn ngày"
                    name="date"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập ngày thống kê.',
                        },
                        {
                            validator: (rule, value, cb) =>
                                new Date(value.format()) >= new Date()
                                    ? cb('Ngày thống kê không được lớn hơn ngày hiện tại.')
                                    : cb(),
                            message: 'Ngày thống kê không được lớn hơn ngày hiện tại.',
                        },
                    ]}
                >
                    <DatePicker onChange={handleDate} />
                </Form.Item>
            </Col>
            <Col span={24}>
                <Pie {...config} />
            </Col>
        </>
    );
};

export default RevenueByDate;

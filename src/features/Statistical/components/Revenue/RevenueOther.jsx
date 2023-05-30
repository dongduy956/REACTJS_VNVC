import { DualAxes } from '@ant-design/plots';
import { Col, Form, DatePicker } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { defaultUTC } from '~/constraints';
import { statisticalService } from '~/services';
import { stringLibrary } from '~/utils';
const RevenueOther = ({ form, setLoading }) => {
    const { RangePicker } = DatePicker;
    const [data, setData] = useState([]);
    const fetchData = async (dateFrom, dateTo) => {
        setLoading(true);
        const result = (await statisticalService.getRevenuesOther(dateFrom, dateTo)).data;
        setData(
            result.map((item) => ({
                ...item,
                date: `${new Date(item.date).getDate()}/${new Date(item.date).getMonth() + 1}/${new Date(
                    item.date,
                ).getFullYear()}`,
            })),
        );
        setLoading(false);
    };

    useEffect(() => {
        (async () => {
            const dates = form.getFieldValue('dates');
            let dateFrom = new Date(dates[0].format());
            dateFrom = new Date(dateFrom.setHours(dateFrom.getHours() + defaultUTC.hours)).toISOString();
            let dateTo = new Date(dates[1].format());
            dateTo = new Date(dateTo.setHours(dateTo.getHours() + defaultUTC.hours)).toISOString();
            await fetchData(dateFrom, dateTo);
        })();
    }, []);
    const handleDates = async (dates) => {
        await fetchData(dates[0].format(), dates[1].format());
    };
    const config = {
        data: [data, data],
        xField: 'date',
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
            <Col span={24}>
                <Form.Item
                    initialValue={[moment(new Date(), 'dd/MM/yyyy'), moment(new Date(), 'dd/MM/yyyy')]}
                    name="dates"
                    label="Chọn ngày"
                    rules={[
                        {
                            type: 'array',
                            required: true,
                            message: 'Vui lòng chọn ngày!',
                        },
                        {
                            validator: (rule, values, cb) =>
                                new Date(values[0].format()) >= new Date()
                                    ? cb('Ngày bắt đầu không được lớn hơn ngày hiện tại.')
                                    : cb(),
                            message: 'Ngày bắt đầu không được lớn hơn ngày hiện tại.',
                        },
                    ]}
                >
                    <RangePicker
                        onChange={handleDates}
                        className="w-full"
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                    />
                </Form.Item>
            </Col>
            <Col span={24}>
                <DualAxes {...config} />
            </Col>
        </>
    );
};

export default RevenueOther;

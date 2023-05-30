import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { statisticalService } from '~/services';
import { Spin } from 'antd';
import { stringLibrary } from '~/utils';

const TopCustomerPay = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const vaccineOutOfStock = (await statisticalService.getTopCustomerPays())?.data;
            setData(vaccineOutOfStock);
            setLoading(false);
        })();
    }, []);
    const config = {
        data,
        xField: 'customerName',
        yField: 'total',
        yAxis: {
            label: {
                formatter: (value) => stringLibrary.formatMoney(value),
            },
        },
        tooltip: {
            showMarkers: false,
            formatter: (datum) => {
                return { name: 'Tổng tiền', value: stringLibrary.formatMoney(datum.total) };
            },
        },
        label: {
            content: (value) => stringLibrary.formatMoney(value.total),
            position: 'middle',
            style: {
                fill: '#FFFFFF',
                opacity: 0.6,
            },
        },
        height: 250,
    };
    return (
        <Spin spinning={loading} tip="Loading...">
            <Column {...config} />
            <h5 className="text-center mt-2">Biểu đồ top 5 khách hàng mua nhiều nhất.</h5>
        </Spin>
    );
};

export default TopCustomerPay;

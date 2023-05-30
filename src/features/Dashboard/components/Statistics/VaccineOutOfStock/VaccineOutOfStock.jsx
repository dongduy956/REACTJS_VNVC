import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { statisticalService } from '~/services';
import { Spin } from 'antd';

const VaccineOutOfStock = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const vaccineOutOfStock = (await statisticalService.getVaccineOutOfStocks())?.data;
            setData(vaccineOutOfStock);
            setLoading(false);
        })();
    }, []);
    const config = {
        data,
        height: 250,
        legend: {},
        xField: 'shipment',
        yField: 'quantityRemain',
        tooltip: {
            showMarkers: false,
            fields: ['shipment', 'quantityRemain', 'vaccine'],
            formatter: (datum) => {
                return { name: datum.vaccine, value: datum.quantityRemain };
            },
        },
        state: {
            active: {
                style: {
                    shadowBlur: 4,
                    stroke: '#000',
                    fill: 'red',
                },
            },
        },

        label: {
            content: (value) => {
                return value.quantityRemain;
            },
        },
        point: {
            size: 5,
            shape: 'diamond',
            style: {
                fill: 'white',
                stroke: '#5B8FF9',
                lineWidth: 2,
            },
        },
        interactions: [
            {
                type: 'marker-active',
            },
        ],
    };
    return (
        <Spin spinning={loading} tip="Loading...">
            <Line {...config} />
            <h5 className="text-center mt-2">Biểu đồ lô - vaccine sắp hoặc đã hết hàng.</h5>
        </Spin>
    );
};
export default VaccineOutOfStock;

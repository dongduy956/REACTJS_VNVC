import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { statisticalService } from '~/services';
import { Spin } from 'antd';

const ShipmentExpires = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const shipmentExpires = (await statisticalService.getShipmentExpires())?.data;
            setData(shipmentExpires);
            setLoading(false);
        })();
    }, []);
    const config = {
        data,
        legend: {},
        xField: 'shipment',
        yField: 'date',
        yAxis: {
            label: {
                formatter: (value) => new Date(value).toLocaleString(),
            },
        },
        tooltip: {
            showMarkers: false,
            fields: ['shipment', 'date', 'vaccine'],
            formatter: (datum) => {
                return { name: datum.vaccine, value: new Date(datum.date).toLocaleString() };
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
        height: 250,
        label: {
            content: (value) => new Date(value.date).toLocaleString(),
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
            <h5 className="text-center mt-2">Biểu đồ lô vaccine sắp hoặc đã hết hạn.</h5>
        </Spin>
    );
};
export default ShipmentExpires;

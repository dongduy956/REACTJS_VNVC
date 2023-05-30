import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { statisticalService } from '~/services';
import { Spin } from 'antd';

const ShipmentInventory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const vaccineOutOfStock = (await statisticalService.getShipmentInventorys())?.data;
            setData(vaccineOutOfStock);
            setLoading(false);
        })();
    }, []);
    const config = {
        data,
        xField: 'shipment',
        yField: 'quantityRemain',
        tooltip: {
            showMarkers: false,
            fields: ['shipment', 'quantityRemain', 'vaccine'],
            formatter: (datum) => {
                return { name: datum.vaccine, value: datum.quantityRemain };
            },
        },
        label: {
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
            <h5 className="text-center mt-2">Biểu đồ lô - vaccine tồn kho.</h5>
        </Spin>
    );
};

export default ShipmentInventory;

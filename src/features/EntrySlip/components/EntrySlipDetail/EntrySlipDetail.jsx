import { Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import { filterPrices } from '~/constraints';
import { entrySlipDetailService, shipmentService, vaccineService } from '~/services';

import { arrayLibrary, stringLibrary } from '~/utils';
const EntrySlipDetail = ({ entrySlip, setEntrySlips, pageCurrent, pageSize }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filterVaccines, setFilterVaccines] = useState([]);
    const [filterShipments, setFilterShipments] = useState([]);
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data)) {
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
        }
    }, [data]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultEntrySlipDetails = await entrySlipDetailService.getEntrySlipDetailsByEntrySlipId(entrySlip.id);
            const resultFilterShipments = (await shipmentService.getAllShipments()).data;
            const resultFilterVaccines = (await vaccineService.getAllVaccines()).data;
            setLoading(false);
            setData(resultEntrySlipDetails.data);
            setFilterShipments(resultFilterShipments);
            setFilterVaccines(resultFilterVaccines);
        })();
    }, []);

    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
        },
        {
            title: 'Lô vaccine',
            dataIndex: 'shipmentCode',
            filters:
                filterShipments.length > 0
                    ? filterShipments.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.shipmentCode.toLowerCase().trim())
                                  ? arr
                                  : [
                                        ...arr,
                                        {
                                            text: item.shipmentCode,
                                            value: item.shipmentCode.toLowerCase().trim(),
                                        },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.shipmentCode.toLowerCase().trim() === value,
        },
        {
            title: 'Vaccine',
            dataIndex: 'vaccineName',
            filters:
                filterVaccines.length > 0
                    ? filterVaccines.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.name.toLowerCase().trim())
                                  ? arr
                                  : [
                                        ...arr,
                                        {
                                            text: item.name,
                                            value: item.name.toLowerCase().trim(),
                                        },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.vaccineName.toLowerCase().trim() === value,
        },
        {
            title: 'Số lượng',
            dataIndex: 'number',
            editable: true,
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            render: (_, record) => stringLibrary.formatMoney(record.price),
            filters: filterPrices,
            onFilter: (value, record) =>
                value.length === 1 ? record.price >= value[0] : record.price >= value[0] && record.price < value[1],
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            render: (_, record) => stringLibrary.formatMoney(record.total),
            filters: filterPrices,
            onFilter: (value, record) =>
                value.length === 1 ? record.total >= value[0] : record.total >= value[0] && record.total < value[1],
        },
    ];

    return (
        <Spin spinning={loading} tip="Loading...">
            <Table
                bordered
                title={() => `Chi tiết phiếu nhập ${entrySlip.id}`}
                bEntrySliped
                dataSource={data}
                columns={columns}
                pagination={false}
            />
        </Spin>
    );
};
export default EntrySlipDetail;

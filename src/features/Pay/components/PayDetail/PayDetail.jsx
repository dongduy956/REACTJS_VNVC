import { Spin, Table } from 'antd';
import { useEffect, useState } from 'react';
import { filterPrices } from '~/constraints';
import { payDetailService, vaccinePackageService, vaccineService } from '~/services';

import { stringLibrary } from '~/utils';
const PayDetail = ({ pay }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [discountPackages, setDiscountPackages] = useState([]);
    const [filterVaccines, setFilterVaccines] = useState([]);
    const [filterVaccinePackages, setFilterVaccinePackages] = useState([]);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const payDetails = (await payDetailService.getPayDetails(pay.id)).data;
            const vaccines = (await vaccineService.getAllVaccines()).data;
            const vaccinePackages = (await vaccinePackageService.getAllVaccinePackages()).data;
            setLoading(false);
            setData(payDetails);
            setFilterVaccines(vaccines);
            setFilterVaccinePackages(vaccinePackages);
        })();
    }, []);
    useEffect(() => {
        (async () => {
            const newData = data.reduce(
                (arr, item) =>
                    item.vaccinePackageId && !arr.find((x) => x.vaccinePackageId === item.vaccinePackageId)
                        ? [
                              ...arr,
                              {
                                  vaccinePackageId: item.vaccinePackageId,
                                  vaccinePackageName: `Giảm giá gói '${item.vaccinePackageName.toLowerCase()}'`,
                                  discount: Number(item.discountPackage) * 100 + '%',
                              },
                          ]
                        : arr,
                [],
            );
            setDiscountPackages(newData);
        })();
    }, [data]);
    useEffect(() => {
        if (data.length)
            if (!data[0].no) {
                setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
            }
    }, [data]);
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
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
            title: 'Gói vaccine',
            dataIndex: 'vaccinePackageName',
            filters:
                filterVaccinePackages.length > 0
                    ? filterVaccinePackages.reduce(
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
            onFilter: (value, record) => record.vaccinePackageName?.toLowerCase().trim() === value,
        },
        {
            title: 'Số lượng',
            dataIndex: 'number',
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            render: (_, record) => record.discount * 100 + '%',
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
                title={() => `Chi tiết thanh toán ${pay.id}`}
                dataSource={data}
                columns={columns}
                pagination={false}
                summary={() => (
                    <>
                        {discountPackages.map((item) => (
                            <Table.Summary.Row>
                                <Table.Summary.Cell className="text-right" index={0} colSpan={6}>
                                    {item.vaccinePackageName}
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>{item.discount}</Table.Summary.Cell>
                            </Table.Summary.Row>
                        ))}
                    </>
                )}
            />
        </Spin>
    );
};
export default PayDetail;

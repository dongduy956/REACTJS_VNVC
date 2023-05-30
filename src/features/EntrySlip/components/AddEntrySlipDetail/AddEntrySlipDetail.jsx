import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, notification, Popconfirm, Spin, Table, Tooltip, Typography } from 'antd';
import lodash from 'lodash';
import { useEffect, useState } from 'react';
import { filterPrices } from '~/constraints';
import {
    entrySlipDetailService,
    entrySlipService,
    orderDetailService,
    shipmentService,
    vaccineService,
} from '~/services';
import { arrayLibrary, stringLibrary } from '~/utils';
const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng nhập ${title.toLowerCase()}`,
                        },
                        {
                            validator: (rule, value, cb) => (value < 0 ? cb(`${title} không được nhỏ hơn 0.`) : cb()),
                            message: `${title} không được nhỏ hơn 0.`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const AddEntrySlipDetail = ({ entrySlipDetails, setEntrySlipDetails }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState('');
    const [filterVaccines, setFilterVaccines] = useState([]);
    const [filterShipments, setFilterShipments] = useState([]);
    const columns = [
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div className="flex justify-center">
                        <Typography.Link onClick={() => save(record.id)} className="mr-4">
                            Lưu
                        </Typography.Link>
                        <Typography.Link onClick={cancel}>Huỷ</Typography.Link>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <Tooltip placement="bottom" title={`Xoá}`} color="cyan">
                            <Typography.Link className="mr-2">
                                <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <DeleteOutlined />
                                </Popconfirm>
                            </Typography.Link>
                        </Tooltip>
                        <Tooltip placement="bottom" title={`Sửa}`} color="cyan">
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                <EditOutlined />
                            </Typography.Link>
                        </Tooltip>
                    </div>
                );
            },
        },
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a, b) => a.no > b.no,
            },
        },
        {
            title: 'Mã đơn đặt hàng',
            dataIndex: 'orderId',
            sorter: {
                compare: (a, b) => a.orderId > b.orderId,
            },
        },
        {
            title: 'Vaccine',
            dataIndex: 'vaccineName',
            sorter: {
                compare: (a, b) => a.vaccineName > b.vaccineName,
            },
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
            title: 'Lô vaccine',
            dataIndex: 'shipmentCode',
            sorter: {
                compare: (a, b) => a.shipmentCode > b.shipmentCode,
            },
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
            title: 'Số lượng',
            editable: true,
            dataIndex: 'number',
            sorter: {
                compare: (a, b) => a.number > b.number,
            },
        },
        {
            title: 'Đơn giá',
            dataIndex: 'price',
            sorter: {
                compare: (a, b) => a.price > b.price,
            },
            render: (_, record) => stringLibrary.formatMoney(record.price),
            filters: filterPrices,
            onFilter: (value, record) =>
                value.length === 1 ? record.price >= value[0] : record.price >= value[0] && record.price < value[1],
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            sorter: {
                compare: (a, b) => a.total > b.total,
            },
            render: (_, record) => stringLibrary.formatMoney(record.total),
            filters: filterPrices,
            onFilter: (value, record) =>
                value.length === 1 ? record.total >= value[0] : record.total >= value[0] && record.total < value[1],
        },
    ];
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultFilterShipments = (await shipmentService.getAllShipments()).data;
            setFilterShipments(resultFilterShipments);
            const resultFilterVaccines = (await vaccineService.getAllVaccines()).data;
            setFilterVaccines(resultFilterVaccines);
            setLoading(false);
        })();
    }, []);
    useEffect(() => {
        if (!entrySlipDetails.every((x) => x.no) || !arrayLibrary.isGrow(entrySlipDetails)) {
            setEntrySlipDetails((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
        }
    }, [entrySlipDetails]);
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'number' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleDelete = (id) => {
        const newEntrySlipDetails = entrySlipDetails.reduce(
            (newArr, entrySlipDetail) => (entrySlipDetail.id !== id ? [...newArr, entrySlipDetail] : newArr),
            [],
        );
        setEntrySlipDetails(newEntrySlipDetails);
    };
    const isEditing = (record) => record.id === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.id);
    };
    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id) => {
        setLoading(true);
        try {
            const row = await form.validateFields();
            const newData = [...entrySlipDetails];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                if (row.number === 0) {
                    newData.splice(index, 1);
                    setEntrySlipDetails(newData);
                } else {
                    const resultOrderDetails = (await orderDetailService.getOrderDetailsByOrderId(item.orderId)).data;
                    const orderDetail = resultOrderDetails.find(
                        (orderDetail) =>
                            orderDetail.shipmentId === item.shipmentId && orderDetail.vaccineId === item.vaccineId,
                    );
                    const resultEntrySlipsByOrderId = (await entrySlipService.getEntrySlipsByOrderId(item.orderId))
                        .data;
                    const entrySlipIds = resultEntrySlipsByOrderId.map((item) => item.id);
                    const resultEntrySlipDetailsByEntrySlipIds = (
                        await entrySlipDetailService.getEntrySlipDetailsByEntrySlipIds(entrySlipIds)
                    ).data;
                    const numberEntrySlipDetail =
                        Number(row.number) +
                        Number(
                            resultEntrySlipDetailsByEntrySlipIds
                                .filter(
                                    (result) =>
                                        result.shipmentId === item.shipmentId && result.vaccineId === item.vaccineId,
                                )
                                .reduce((sum, item) => sum + item.number, 0),
                        );
                    if (orderDetail.number >= numberEntrySlipDetail) {
                        newData.splice(index, 1, {
                            ...item,
                            ...row,
                            total: row.number * item.price,
                        });
                        setEntrySlipDetails(newData);
                    } else {
                        notification.warning({
                            message: 'Cảnh báo',
                            description: 'Không được vượt quá số lượng trong phiếu đặt hàng.',
                            duration: 3,
                        });
                    }
                }

                setEditingKey('');
            } else {
                newData.push(row);
                setEntrySlipDetails(newData);
                setEditingKey('');
            }
        } catch (errInfo) {}
        setLoading(false);
    };

    return (
        <Spin spinning={loading} tip="Loading...">
            <Form form={form} component={false}>
                <Table
                    bordered
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    dataSource={lodash.cloneDeep(entrySlipDetails)}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={false}
                    scroll={{
                        x: true,
                    }}
                />
            </Form>
        </Spin>
    );
};
export default AddEntrySlipDetail;

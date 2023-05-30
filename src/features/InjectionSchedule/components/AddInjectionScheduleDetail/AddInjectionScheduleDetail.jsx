import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Badge, Form, Input, Popconfirm, Select, Spin, Table, Tooltip, Typography } from 'antd';
import lodash from 'lodash';
import { useEffect, useState } from 'react';
import { filterPrices, injectionStaff } from '~/constraints';
import { shipmentService, staffService, vaccinePackageService, vaccineService } from '~/services';
import { arrayLibrary, stringLibrary } from '~/utils';
const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, staffs, ...restProps }) => {
    const inputNode =
        inputType === 'select' ? (
            <Select>
                {staffs.map((x) => (
                    <Select.Option value={x.id}>{x.staffName}</Select.Option>
                ))}
            </Select>
        ) : (
            <Input />
        );
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
const AddInjectionScheduleDetail = ({ injectionScheduleDetails, setInjectionScheduleDetails }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState('');
    const [filterVaccines, setFilterVaccines] = useState([]);
    const [filterShipments, setFilterShipments] = useState([]);
    const [filterStaffs, setFilterStaffs] = useState([]);
    const [filterVaccinePackages, setFilterVaccinePackages] = useState([]);
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
                        <Tooltip className="mr-2" placement="bottom" title={'Xoá'} color="cyan">
                            <Typography.Link>
                                <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <DeleteOutlined />
                                </Popconfirm>
                            </Typography.Link>
                        </Tooltip>
                        <Tooltip placement="bottom" title={'Sửa'} color="cyan">
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
            dataIndex: 'id',
        },
        {
            title: 'Lô hàng',
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
            title: 'Gói tiêm',
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
            title: 'Địa chỉ',
            dataIndex: 'address',
            editable: true,
        },
        {
            title: 'Nhân viên tiêm',
            dataIndex: 'injectionStaffName',
            editable: true,
            filters:
                filterStaffs.length > 0
                    ? filterStaffs.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.staffName.toLowerCase().trim())
                                  ? arr
                                  : [
                                        ...arr,
                                        {
                                            text: item.staffName,
                                            value: item.staffName.toLowerCase().trim(),
                                        },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.injectionStaffName?.toLowerCase().trim() === value,
        },
        {
            title: 'Liều lượng',
            dataIndex: 'amount',
        },

        {
            title: 'Thứ tự tiêm',
            dataIndex: 'injections',
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
            title: 'Giảm giá',
            dataIndex: 'discount',
            render: (_, record) => record.discount * 100 + '%',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'total',
            render: (_, record) => stringLibrary.formatMoney(record.total),
            filters: filterPrices,
            onFilter: (value, record) =>
                value.length === 1 ? record.total >= value[0] : record.total >= value[0] && record.total < value[1],
        },
        {
            title: 'Tiêm chung',
            dataIndex: 'isGeneral',
            render: (_, record) => (
                <>
                    {record.vaccinePackageId && (
                        <span>
                            <Badge status={record.isGeneral ? 'success' : 'processing'} />
                            <span>{record.isGeneral ? 'Tiêm chung' : 'Không tiêm chung'}</span>
                        </span>
                    )}
                </>
            ),
        },
    ];
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultFilterShipments = (await shipmentService.getAllShipments()).data;
            setFilterShipments(resultFilterShipments);
            const resultFilterVaccines = (await vaccineService.getAllVaccines()).data;
            setFilterVaccines(resultFilterVaccines);
            const resultFilterStaffs = (await staffService.getAllStaffs()).data.filter(
                (x) => x.permissionName.toLowerCase().trim() === injectionStaff.doctor,
            );
            setFilterStaffs(resultFilterStaffs);
            const resultFilterVaccinePackages = (await vaccinePackageService.getAllVaccinePackages()).data;
            setFilterVaccinePackages(resultFilterVaccinePackages);
            setLoading(false);
        })();
    }, []);

    useEffect(() => {
        if (!injectionScheduleDetails.every((x) => x.id) || !arrayLibrary.isGrow(injectionScheduleDetails))
            setInjectionScheduleDetails((pre) => pre.map((x, i) => ({ ...x, id: i + 1 })));
    }, [injectionScheduleDetails]);
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'injectionStaffName' ? 'select' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                staffs: filterStaffs,
            }),
        };
    });

    const handleDelete = (id) => {
        const vaccinePackageId = injectionScheduleDetails.find((item) => item.id === id).vaccinePackageId ?? 0;
        let newInjectionScheduleDetails = injectionScheduleDetails.reduce(
            (newArr, injectionDetail) => (injectionDetail.id !== id ? [...newArr, injectionDetail] : newArr),
            [],
        );
        if (vaccinePackageId)
            newInjectionScheduleDetails = newInjectionScheduleDetails.reduce(
                (newArr, injectionDetail) =>
                    injectionDetail.vaccinePackageId !== vaccinePackageId ? [...newArr, injectionDetail] : newArr,
                [],
            );
        newInjectionScheduleDetails = newInjectionScheduleDetails.map((item, index) => ({ ...item, id: index + 1 }));
        setInjectionScheduleDetails(newInjectionScheduleDetails);
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
            const newData = [...injectionScheduleDetails];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const item = newData[index];
                const injectionStaffId = Number.isInteger(row.injectionStaffName)
                    ? row.injectionStaffName
                    : form.getFieldValue('injectionStaffId');
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                    injectionStaffId,
                    injectionStaffName: filterStaffs.find((x) => x.id === injectionStaffId).staffName,
                });
                setInjectionScheduleDetails(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setInjectionScheduleDetails(newData);
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
                    dataSource={lodash.cloneDeep(injectionScheduleDetails)}
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
export default AddInjectionScheduleDetail;

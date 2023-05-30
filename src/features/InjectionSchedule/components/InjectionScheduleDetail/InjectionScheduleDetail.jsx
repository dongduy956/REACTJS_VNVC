import { AlipayCircleOutlined, EditOutlined } from '@ant-design/icons';
import { Badge, Form, Input, InputNumber, notification, Select, Table, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { injectionStaff, namePages } from '~/constraints';
import {
    injectionScheduleDetailService,
    shipmentService,
    staffService,
    vaccinePackageDetailService,
    vaccinePackageService,
    vaccineService,
} from '~/services';
import { arrayLibrary, roles } from '~/utils';
import AddInjectionIncident from '../AddInjectionIncident/AddInjectionIncident';
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
const InjectionScheduleDetail = ({ injectionSchedule, checkUpdate, setCheckUpdate }) => {
    const namePage = namePages.InjectionScheduleDetail.name;
    const { isPermissionEdit, isPermissionCreate } = roles;
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openInjectionIncident, setOpenInjectionIncident] = useState(false);
    const [injectionScheduleDetail, setInjectionScheduleDetail] = useState({});
    const [filterVaccines, setFilterVaccines] = useState([]);
    const [filterShipments, setFilterShipments] = useState([]);
    const [filterStaffs, setFilterStaffs] = useState([]);
    const [filterVaccinePackages, setFilterVaccinePackages] = useState([]);
    const setInjectionDetails = async () => {
        const resultInjectionDetail = await injectionScheduleDetailService.getInjectionScheduleDetails(
            injectionSchedule.id,
        );
        const newData = [];
        for (let i = 0; i < resultInjectionDetail.data.length; i++) {
            const injectionDetail = resultInjectionDetail.data[i];
            if (injectionDetail.vaccinePackageId) {
                const resultVaccinePackageDetail = await vaccinePackageDetailService.getVaccinePackageDetail(
                    injectionDetail.vaccinePackageId,
                    injectionDetail.shipmentId,
                );
                newData.push({ ...injectionDetail, isGeneral: resultVaccinePackageDetail.data.isGeneral });
            } else newData.push(injectionDetail);
        }
        setData(newData);
    };
    useEffect(() => {
        (async () => {
            setLoading(true);

            await setInjectionDetails();

            setLoading(false);
        })();
    }, [checkUpdate]);
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data)) {
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
        }
    }, [data]);
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
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
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
            title: 'Liều lượng',
            dataIndex: 'amount',
        },
        {
            title: 'Thời gian tiêm',
            dataIndex: 'injectionTime',
            render: (_, record) => (record.injectionTime ? new Date(record.injectionTime).toLocaleString() : ''),
        },
        {
            title: 'Thứ tự tiêm',
            dataIndex: 'injections',
        },
        {
            title: 'Thanh toán',
            dataIndex: 'pay',
            render: (_, record) => (
                <>
                    {record.pay ? (
                        <>
                            <Badge className="mr-2" status="success" />
                            Đã thanh toán
                        </>
                    ) : (
                        <>
                            <Badge className="mr-2" status="error" />
                            Chưa thanh toán
                        </>
                    )}
                </>
            ),
            filters: [
                { text: 'Đã thanh toán', value: true },
                { text: 'Chưa thanh toán', value: false },
            ],
            onFilter: (value, record) => record.pay === value,
        },
        {
            title: 'Tiêm',
            dataIndex: 'injection',
            render: (_, record) => (
                <>
                    {record.injection ? (
                        <>
                            <Badge className="mr-2" status="success" />
                            Đã tiêm
                        </>
                    ) : record.pay && isPermissionEdit(namePage) ? (
                        <Typography.Link onClick={() => handleUpdateInjection(record.id)}>
                            <Badge className="mr-2" status="error" />
                            Chưa tiêm
                        </Typography.Link>
                    ) : (
                        <>
                            <Badge className="mr-2" status="error" />
                            Chưa tiêm
                        </>
                    )}
                </>
            ),
            filters: [
                { text: 'Đã tiêm', value: true },
                { text: 'Chưa tiêm', value: false },
            ],
            onFilter: (value, record) => record.injection === value,
        },
        {
            title: 'Tiêm chung',
            dataIndex: 'isGeneral',
            render: (_, record) => (
                <>
                    {record.vaccinePackageId && (
                        <>
                            <Badge className="mr-2" status={record.isGeneral ? 'success' : 'processing'} />
                            <span>{record.isGeneral ? 'Tiêm chung' : 'Không tiêm chung'}</span>
                        </>
                    )}
                </>
            ),
        },
    ];
    if (isPermissionCreate(namePages.InjectionIncident.name) || isPermissionEdit(namePage))
        columns.unshift({
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
                        {record.injection &&
                            !record.checkReport &&
                            isPermissionCreate(namePages.InjectionIncident.name) && (
                                <Tooltip placement="bottom" title={'Báo cáo'} className="mr-2" color="cyan">
                                    <Typography.Link
                                        onClick={() => {
                                            setOpenInjectionIncident(true);
                                            setInjectionScheduleDetail(record);
                                        }}
                                        className="hover:text-cyan-500 cursor-pointer"
                                    >
                                        <AlipayCircleOutlined />
                                    </Typography.Link>
                                </Tooltip>
                            )}
                        {!record.injection && isPermissionEdit(namePage) && (
                            <Tooltip placement="bottom" title={'Sửa'} color="cyan">
                                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                    <EditOutlined />
                                </Typography.Link>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        });
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
    //lưu dữ liệu sửa 1 dòng
    const save = async (id) => {
        setLoading(true);
        try {
            const row = await form.validateFields();
            if (id > 0) {
                const resultUpdate =
                    await injectionScheduleDetailService.updateAddressInjectionStaffInjectionScheduleDetail(
                        id,
                        row.address,
                        Number.isInteger(row.injectionStaffName)
                            ? row.injectionStaffName
                            : form.getFieldValue('injectionStaffId'),
                    );
                if (resultUpdate.isSuccess) {
                    setCheckUpdate((pre) => !pre);
                    notification.success({
                        message: 'Thành công',
                        description: resultUpdate.messages[0],
                        duration: 3,
                    });
                }
                setEditingKey('');
            }
        } catch (errInfo) {}
        setLoading(false);
    };
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

    const handleUpdateInjection = async (id) => {
        setLoading(true);
        const res = await injectionScheduleDetailService.updateInjectionInjectionScheduleDetail(id);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi cập nhật chi tiết lịch tiêm.',
                duration: 3,
            });
        else if (res.isSuccess) {
            notification.success({
                message: 'Thành công',
                description: res.messages[0],
                duration: 3,
            });
            await setInjectionDetails();
        } else
            notification.error({
                message: 'Lỗi',
                description: res.messages[0],
                duration: 3,
            });
        setLoading(false);
    };

    return (
        <>
            {isPermissionCreate(namePages.InjectionIncident.name) && (
                <AddInjectionIncident
                    open={openInjectionIncident}
                    setLoading={setLoading}
                    setOpen={setOpenInjectionIncident}
                    injectionScheduleDetail={injectionScheduleDetail}
                    setCheckUpdate={setCheckUpdate}
                />
            )}
            <Form form={form} component={false}>
                <Table
                    loading={loading}
                    bordered
                    scroll={{
                        x: true,
                    }}
                    dataSource={data}
                    pagination={false}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    rowKey={(record) => record.id}
                />
            </Form>
        </>
    );
};
export default InjectionScheduleDetail;

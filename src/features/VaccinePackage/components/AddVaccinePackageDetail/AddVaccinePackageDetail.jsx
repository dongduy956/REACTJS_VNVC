import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Badge, Checkbox, Form, Input, InputNumber, Popconfirm, Spin, Table, Tooltip, Typography } from 'antd';
import lodash from 'lodash';
import { useEffect, useState } from 'react';
import { shipmentService, vaccineService } from '~/services';
import { arrayLibrary } from '~/utils';
const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    checked,
    setChecked,
    children,
    ...restProps
}) => {
    useEffect(() => {
        editing && setChecked(record.isGeneral);
    }, [editing]);

    const handleChecked = (e) => {
        setChecked(e.target.checked);
    };
    const inputNode =
        inputType === 'number' ? (
            <InputNumber />
        ) : inputType === 'checkbox' ? (
            <Checkbox checked={checked} onChange={handleChecked} />
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
                    rules={
                        inputType !== 'checkbox' && [
                            {
                                required: true,
                                message: `Vui lòng nhập ${title.toLowerCase()}`,
                            },
                            {
                                validator: (rule, value, cb) =>
                                    value <= 0 ? cb(`${title} không được nhỏ hơn hoặc bằng 0.`) : cb(),
                                message: `${title} không được nhỏ hơn hoặc bằng 0.`,
                            },
                        ]
                    }
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const AddVaccinePackageDetail = ({ vaccinePackageDetails, setVaccinePackageDetails }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState('');
    const [checked, setChecked] = useState();
    const [filterVaccines, setFilterVaccines] = useState([]);
    const [filterShipments, setFilterShipments] = useState([]);
    const columns = [
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.id)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Bạn chắc chắn huỷ?" onConfirm={cancel}>
                            <a>Huỷ</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div className="flex justify-center">
                        <Tooltip placement="bottom" title={`Xoá`} color="cyan">
                            <Typography.Link className="mr-2">
                                <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                    <DeleteOutlined />
                                </Popconfirm>
                            </Typography.Link>
                        </Tooltip>
                        <Tooltip placement="bottom" title={`Sửa`} color="cyan">
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
                                        { text: item.shipmentCode, value: item.shipmentCode.toLowerCase().trim() },
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
                                  : [...arr, { text: item.name, value: item.name.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.vaccineName.toLowerCase().trim() === value,
        },
        {
            title: 'Số lượng mũi tiêm',
            dataIndex: 'numberOfInjections',
            editable: true,
        },
        {
            title: 'Thứ tự tiêm',
            dataIndex: 'orderInjection',
        },
        {
            title: 'Tiêm chung',
            dataIndex: 'isGeneral',
            editable: true,
            render: (_, record) => (
                <span>
                    <Badge title="dfas" status={record.isGeneral ? 'success' : 'processing'} />
                    <span className="ml-2">{record.isGeneral ? 'Tiêm chung' : 'Không tiêm chung'}</span>
                </span>
            ),
            filters: [
                { text: 'Tiêm chung', value: true },
                { text: 'Không tiêm chung', value: false },
            ],
            onFilter: (value, record) => record.isGeneral === value,
        },
    ];
    useEffect(() => {
        (async () => {
            setLoading(true);
            const vaccines = (await vaccineService.getAllVaccines()).data;
            setFilterVaccines(vaccines);
            const shipments = (await shipmentService.getAllShipments()).data;
            setFilterShipments(shipments);
            setLoading(false);
        })();
    }, []);
    useEffect(() => {
        if (!vaccinePackageDetails.every((x) => x.no) || !arrayLibrary.isGrow(vaccinePackageDetails))
            setVaccinePackageDetails((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [vaccinePackageDetails]);

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'numberOfInjections' ? 'number' : 'checkbox',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                checked,
                setChecked,
            }),
        };
    });

    const handleDelete = (id) => {
        let newVaccinePackageDetails = vaccinePackageDetails.reduce(
            (newArr, vaccinePackageDetail) =>
                vaccinePackageDetail.id !== id ? [...newArr, vaccinePackageDetail] : newArr,
            [],
        );
        newVaccinePackageDetails = newVaccinePackageDetails.map((item, index) => ({ ...item, id: index + 1 }));
        setVaccinePackageDetails(newVaccinePackageDetails);
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
            row.isGeneral = checked;
            const newData = [...vaccinePackageDetails];
            let vaccinePackageDetail = newData.find((item) => id === item.id);
            if (vaccinePackageDetail) {
                vaccinePackageDetail.numberOfInjections = row.numberOfInjections;
                vaccinePackageDetail.isGeneral = row.isGeneral;
                setVaccinePackageDetails(newData);
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
                    dataSource={lodash.cloneDeep(vaccinePackageDetails)}
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
export default AddVaccinePackageDetail;

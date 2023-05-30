import React, { useEffect, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import {
    Badge,
    Button,
    Checkbox,
    Col,
    Form,
    Input,
    InputNumber,
    notification,
    Popconfirm,
    Row,
    Select,
    Spin,
    Table,
    Tooltip,
    Typography,
} from 'antd';
import { regulationInjectionService, shipmentService, vaccinePackageDetailService, vaccineService } from '~/services';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Modal from '~/components/Modal';
import { arrayLibrary, readDetail, roles } from '~/utils';
import { namePages } from '~/constraints';
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
const Edit = ({ vaccinePackage }) => {
    const { isPermissionView, isPermissionDelete, isPermissionEdit } = roles;
    const namePage = namePages.VaccinePackageDetail.name;
    const [dataModalVaccine, setDataModalVaccine] = useState({});
    const [openModalVaccine, setOpenModalVaccine] = useState(false);
    const [dataModalShipment, setDataModalShipment] = useState({});
    const [openModalShipment, setOpenModalShipment] = useState(false);
    const [form] = Form.useForm();
    const [formVaccinePackageDetail] = Form.useForm();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState('');
    const [shipments, setShipments] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [filterShipments, setFilterShipments] = useState([]);
    const [isGeneral, setIsGeneral] = useState(false);
    const [checked, setChecked] = useState();
    const fetchData = async (params) => {
        setLoading(true);
        if (data.find((item) => item.shipmentId !== params.shipmentId && item.vaccineId === params.vaccineId))
            notification.warn({
                message: 'Cảnh báo',
                description: 'Đã có vaccine này rồi',
                duration: 3,
            });
        else {
            const vaccinePackageDetail = data.find((item) => item.shipmentId === params.shipmentId);
            let res;
            if (vaccinePackageDetail)
                res = await vaccinePackageDetailService.updateVaccinePackageDetail(vaccinePackageDetail.id, {
                    numberOfInjections:
                        Number(vaccinePackageDetail.numberOfInjections) + Number(params.numberOfInjections),
                    isGeneral: vaccinePackageDetail.isGeneral,
                });
            else res = await vaccinePackageDetailService.insertVaccinePackageDetail(params);
            if (res.status === 500)
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi thêm chi tiết gói vac-xin.',
                    duration: 3,
                });
            else if (res.isSuccess) {
                notification.success({
                    message: 'Thành công',
                    description: res.messages[0],
                    duration: 3,
                });
                setLoading(true);
                const resultVaccinePackageDetail =
                    await vaccinePackageDetailService.getVaccinePackageDetailsByVaccinePackageId(vaccinePackage.id);
                setData(resultVaccinePackageDetail.data);
                setLoading(false);
            } else
                notification.error({
                    message: 'Lỗi',
                    description: res.messages[0],
                    duration: 3,
                });
        }
        setLoading(false);
    };
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data)) {
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
        }
    }, [data]);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const vaccinePackageDetails = (
                await vaccinePackageDetailService.getVaccinePackageDetailsByVaccinePackageId(vaccinePackage.id)
            ).data;
            setData(vaccinePackageDetails);
            const resultVaccines = (await vaccineService.getAllVaccines()).data;
            setVaccines(resultVaccines);
            const resultShipments = (await shipmentService.getAllShipments()).data;
            setFilterShipments(resultShipments);
            setLoading(false);
        })();
    }, []);
    const handleDelete = (id) => {
        (async () => {
            setLoading(true);
            const res = await vaccinePackageDetailService.deleteVaccinePackageDetail(id);
            if (res.data)
                notification.success({
                    message: 'Thành công',
                    description: res.messages[0],
                    duration: 3,
                });
            else
                notification.error({
                    message: 'Lỗi',
                    description: res.messages[0],
                    duration: 3,
                });
            const resultVaccinePackageDetail =
                await vaccinePackageDetailService.getVaccinePackageDetailsByVaccinePackageId(vaccinePackage.id);
            setData(resultVaccinePackageDetail.data);
            setLoading(false);
        })();
    };
    const isEditing = (record) => record.id === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            id: '',
            vaccineName: '',
            numberOfInjections: '',
            orderInjection: '',
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
            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const res = await vaccinePackageDetailService.updateVaccinePackageDetail(id, row);
                if (res.data) {
                    notification.success({
                        message: 'Thành công',
                        description: res.messages[0],
                        duration: 3,
                    });
                    const resultVaccinePackageDetail =
                        await vaccinePackageDetailService.getVaccinePackageDetailsByVaccinePackageId(vaccinePackage.id);
                    setData(resultVaccinePackageDetail.data);
                    setEditingKey('');
                } else
                    notification.error({
                        message: 'Lỗi',
                        description: res.messages[0],
                        duration: 3,
                    });
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {}
        setLoading(false);
    };
    const columns = [
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
                vaccines.length > 0
                    ? vaccines.reduce(
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
    if (isPermissionEdit(namePage) || isPermissionDelete(namePage))
        columns.unshift({
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
                        {isPermissionDelete(namePage) && (
                            <Tooltip placement="bottom" title={`Xoá`} color="cyan">
                                <Typography.Link className="mr-2">
                                    <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </Typography.Link>
                            </Tooltip>
                        )}
                        {isPermissionEdit(namePage) && (
                            <Tooltip placement="bottom" title={`Sửa`} color="cyan">
                                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                    <EditOutlined />
                                </Typography.Link>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        });
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
    const onFinish = (params) => {
        params.vaccinePackageId = vaccinePackage.id;
        params.isGeneral = isGeneral;
        fetchData(params);
    };
    const handleVaccine = async (vaccineId) => {
        formVaccinePackageDetail.setFieldsValue({
            shipmentId: -1,
        });
        setLoading(true);
        const resultShipments = (await shipmentService.getShipmentsByVaccineId(vaccineId)).data;
        setShipments(resultShipments);
        const resultRegulationInjection = await regulationInjectionService.getRegulationInjectionByVaccineId(vaccineId);
        if (resultRegulationInjection.isSuccess)
            formVaccinePackageDetail.setFieldValue('orderInjection', resultRegulationInjection.data.order);
        setLoading(false);
    };

    const handleIsGeneral = (e) => {
        setIsGeneral(e.target.checked);
    };
    const handleDetailShipment = async () => {
        await readDetail(
            formVaccinePackageDetail,
            'shipmentId',
            setLoading,
            'shipment',
            setDataModalShipment,
            setOpenModalShipment,
        );
    };
    const handleDetailVaccine = async () => {
        await readDetail(
            formVaccinePackageDetail,
            'vaccineId',
            setLoading,
            'vaccine',
            setDataModalVaccine,
            setOpenModalVaccine,
        );
    };

    return (
        <>
            <Modal
                open={openModalShipment}
                setOpen={setOpenModalShipment}
                data={dataModalShipment}
                title="Thông tin lô vaccine"
            />
            <Modal
                open={openModalVaccine}
                setOpen={setOpenModalVaccine}
                data={dataModalVaccine}
                title="Thông tin vaccine"
            />
            <Spin spinning={loading} tip="Loading...">
                <Form form={form} component={false}>
                    {isPermissionView(namePage) && (
                        <Form
                            form={formVaccinePackageDetail}
                            name="wrap"
                            labelCol={{
                                flex: '110px',
                            }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{
                                flex: 1,
                            }}
                            colon={false}
                            onFinish={onFinish}
                        >
                            <Row gutter={[16, 0]}>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        rules={[
                                            { required: true },
                                            {
                                                message: 'Vui lòng chọn vaccine.',
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn vaccine.') : cb(),
                                            },
                                        ]}
                                        label="Vaccine"
                                        name="vaccineId"
                                        initialValue={-1}
                                    >
                                        <Select
                                            suffixIcon={<InfoCircleOutlined onClick={handleDetailVaccine} />}
                                            onChange={handleVaccine}
                                        >
                                            <Select.Option value={-1}>Chọn vaccine</Select.Option>
                                            {vaccines.map((vaccine) => (
                                                <Select.Option key={vaccine.id} value={vaccine.id}>
                                                    {vaccine.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        rules={[
                                            { required: true },
                                            {
                                                message: 'Vui lòng chọn lô vaccine.',
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn lô vaccine.') : cb(),
                                            },
                                        ]}
                                        label="Lô vaccine"
                                        name="shipmentId"
                                        initialValue={-1}
                                    >
                                        <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailShipment} />}>
                                            <Select.Option value={-1}>Chọn lô vaccine</Select.Option>
                                            {shipments.map((shipment) => (
                                                <Select.Option key={shipment.id} value={shipment.id}>
                                                    {shipment.shipmentCode}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Thứ tự tiêm"
                                        initialValue={0}
                                        name="orderInjection"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0
                                                        ? cb('Vui lòng chọn vaccine để hiện thị thứ tự tiêm.')
                                                        : cb(),
                                                message: 'Vui lòng chọn vaccine để hiện thị thứ tự tiêm.',
                                            },
                                        ]}
                                    >
                                        <Input disabled type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Số lượng mũi tiêm"
                                        name="numberOfInjections"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ số lượng mũi tiêm.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0
                                                        ? cb('Số lượng mũi tiêm không được nhỏ hơn hoặc bằng 0.')
                                                        : cb(),
                                                message: 'Số lượng mũi tiêm không được nhỏ hơn hoặc bằng 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item label="Tiêm chung" name="isGeneral">
                                        <Checkbox checked={isGeneral} onChange={handleIsGeneral} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        <Button className="ml-2" type="primary" htmlType="submit">
                                            Thêm
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    )}
                    <Table
                        bordered
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        dataSource={data}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={false}
                    />
                </Form>
            </Spin>
        </>
    );
};
export default Edit;

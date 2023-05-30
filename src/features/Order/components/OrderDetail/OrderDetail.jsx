import { InfoCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    Button,
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
import { useEffect, useState } from 'react';
import Modal from '~/components/Modal';
import { filterPrices, namePages } from '~/constraints';
import { orderDetailService, orderService, shipmentService, vaccinePriceService, vaccineService } from '~/services';

import { arrayLibrary, readDetail, roles, stringLibrary } from '~/utils';

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
                            validator: (rule, value, cb) =>
                                value <= 0 ? cb(`${title} không được nhỏ hơn hoặc bằng 0.`) : cb(),
                            message: `${title} không được nhỏ hơn hoặc bằng 0.`,
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
const OrderDetail = ({ order, setOrders, pageCurrent, pageSize }) => {
    const { isPermissionDelete, isPermissionView, isPermissionEdit, isPermissionCreate } = roles;
    const namePage = namePages.OrderDetail.name;
    const [form] = Form.useForm();
    const [formAdd] = Form.useForm();
    //data xem chi tiết
    const [dataModalShipment, setDataModalShipment] = useState({});
    const [openModalShipment, setOpenModalShipment] = useState(false);
    //data filter
    const [filterVaccines, setFilterVaccines] = useState([]);
    const [filterShipments, setFilterShipments] = useState([]);
    //data table
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingKey, setEditingKey] = useState('');
    //data combox lô hàng
    const [shipments, setShipments] = useState([]);

    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data)) {
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
        }
    }, [data]);
    const fetchData = async (params) => {
        setLoading(true);
        //kiểm tra trong chi tiết đặt hàng có lô, vaccine tương ứng chưàng
        const orderDetail = data.find(
            (item) => item.shipmentId === params.shipmentId && item.vaccineId === params.vaccineId,
        );
        let res;
        //có thì update sl lại vào db
        if (orderDetail)
            res = await orderDetailService.updateOrderDetail(orderDetail.id, {
                number: Number(orderDetail.number) + Number(params.number),
            });
        //chưa có thì thêm vào db
        else res = await orderDetailService.insertOrderDetail(params);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi thêm chi tiết đặt hàng.',
                duration: 3,
            });
        else if (res.isSuccess) {
            notification.success({
                message: 'Thành công',
                description: res.messages[0],
                duration: 3,
            });
            setLoading(true);
            const resultOrderDetails = await orderDetailService.getOrderDetailsByOrderId(order.id);
            const resultOrders = await orderService.getOrders(pageCurrent, pageSize);
            setOrders(resultOrders.data);
            setData(resultOrderDetails.data);
        } else
            notification.error({
                message: 'Lỗi',
                description: res.messages[0],
                duration: 3,
            });
        setLoading(false);
    };
    //lấy dữ liệu lần đầu load trang
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultOrderDetails = (await orderDetailService.getOrderDetailsByOrderId(order.id)).data;
            const resultShipments = (await shipmentService.getShipmentsBySupplierId(order.supplierId)).data;
            const resultFilterShipments = (await shipmentService.getAllShipments()).data;
            const resultFilterVaccines = (await vaccineService.getAllVaccines()).data;
            setLoading(false);
            setShipments(resultShipments);
            setFilterShipments(resultFilterShipments);
            setFilterVaccines(resultFilterVaccines);
            setData(resultOrderDetails);
        })();
    }, []);
    //xử lý khi chọn lô
    const handleShipment = async (shipmentId) => {
        setLoading(true);
        const resultVaccine = await vaccineService.getVaccineByShipmentId(shipmentId);
        if (resultVaccine.isSuccess) {
            formAdd.setFieldsValue({
                vaccineId: resultVaccine.data.id,
                vaccineName: resultVaccine.data.name,
            });
            const resultVaccinePrice = await vaccinePriceService.getVaccinePriceLastByVaccineIdAndShipmentId(
                resultVaccine.data.id,
                shipmentId,
            );
            if (resultVaccinePrice.isSuccess)
                formAdd.setFieldsValue({
                    price: resultVaccinePrice.data.entryPrice,
                });
            else
                formAdd.setFieldsValue({
                    price: 0,
                });
        } else {
            formAdd.setFieldsValue({
                vaccineId: 0,
                vaccineName: '',
                price: 0,
            });
        }
        setLoading(false);
    };
    const handleDelete = (id) => {
        (async () => {
            setLoading(true);
            const res = await orderDetailService.deleteOrderDetail(id);
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
            const resultOrderDetail = await orderDetailService.getOrderDetailsByOrderId(order.id);
            setData(resultOrderDetail.data);
            setLoading(false);
        })();
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
    //update sl khi thay đổi số lượng chi tiết

    const save = async (id) => {
        setLoading(true);
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const res = await orderDetailService.updateOrderDetail(id, row);
                if (res.data) {
                    notification.success({
                        message: 'Thành công',
                        description: res.messages[0],
                        duration: 3,
                    });
                    const resultOrderDetails = await orderDetailService.getOrderDetailsByOrderId(order.id);
                    const resultOrders = await orderService.getOrders(pageCurrent, pageSize);
                    setOrders(resultOrders.data);
                    setData(resultOrderDetails.data);
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
    if (!order.status && (isPermissionDelete(namePage) || isPermissionEdit(namePage)))
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
                        <Typography.Link
                            onClick={cancel}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Huỷ
                        </Typography.Link>
                    </span>
                ) : (
                    <div className="flex justify-center">
                        {isPermissionDelete(namePage) && (
                            <Tooltip placement="bottom" title={`Xoá}`} color="cyan">
                                <Typography.Link className="mr-2">
                                    <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </Typography.Link>
                            </Tooltip>
                        )}
                        {isPermissionEdit(namePage) && (
                            <Tooltip placement="bottom" title={`Sửa}`} color="cyan">
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
                inputType: col.dataIndex === 'number' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    //chạy khi bấm thêm
    const onFinish = (params) => {
        params.orderId = order.id;
        fetchData(params);
    };
    //xử lý data khi xem chi tiết
    const handleDetailShipment = async () => {
        await readDetail(formAdd, 'shipmentId', setLoading, 'shipment', setDataModalShipment, setOpenModalShipment);
    };
    return (
        <>
            <Modal
                open={openModalShipment}
                setOpen={setOpenModalShipment}
                data={dataModalShipment}
                title="Thông tin lô vaccine"
            />
            <Spin spinning={loading} tip="Loading...">
                <Form form={form} component={false}>
                    {!order.status && isPermissionCreate(namePage) && (
                        <Form
                            form={formAdd}
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
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn lô vaccine.') : cb(),
                                                message: 'Vui lòng chọn lô vaccine.',
                                            },
                                        ]}
                                        label="Lô vaccine"
                                        name="shipmentId"
                                        initialValue={-1}
                                    >
                                        <Select
                                            onChange={handleShipment}
                                            suffixIcon={<InfoCircleOutlined onClick={handleDetailShipment} />}
                                        >
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
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn lô vaccine để hiển thị vaccine.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1
                                                        ? cb('Vui lòng chọn lô vaccine để hiển thị vaccine.')
                                                        : cb(),
                                                message: 'Vui lòng chọn lô vaccine để hiển thị vaccine.',
                                            },
                                        ]}
                                        label="Vaccine"
                                        name="vaccineName"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col hidden span={24} sm={{ span: 12 }}>
                                    <Form.Item label="Vaccine" name="vaccineId">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Giá"
                                        name="price"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn vaccine để hiển thị giá.',
                                            },
                                        ]}
                                    >
                                        <Input disabled type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Số lượng"
                                        name="number"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ số lượng.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Số lượng không được nhỏ hơn hoặc bằng 0.') : cb(),
                                                message: 'Số lượng không được nhỏ hơn hoặc bằng 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
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
                    {isPermissionView(namePage) && (
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
                    )}
                </Form>
            </Spin>
        </>
    );
};
export default OrderDetail;

import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, notification, Row, Select, Spin } from 'antd';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configStorage, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import {
    entrySlipDetailService,
    entrySlipService,
    orderDetailService,
    orderService,
    shipmentService,
    vaccineService,
} from '~/services';
import { readDetail } from '~/utils';
import AddEntrySlipDetail from '../../components/AddEntrySlipDetail';
const Add = () => {
    useAuth();
    const [form] = Form.useForm();
    const history = useNavigate();
    //data xem chi tiết
    const [dataModalOrder, setDataModalOrder] = useState({});
    const [openModalOrder, setOpenModalOrder] = useState(false);
    const [dataModalShipment, setDataModalShipment] = useState({});
    const [openModalShipment, setOpenModalShipment] = useState(false);
    const [loading, setLoading] = useState(false);
    //data combobox đơn hàng
    const [orders, setOrders] = useState([]);
    //combobox lô
    const [shipments, setShipments] = useState([]);
    //data table
    const [entrySlipDetails, setEntrySlipDetails] = useState([]);
    //id nhà cung cấp
    const [supplierId, setSupplierId] = useState(-1);
    //lấy data đơn hàng
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultOrders = await orderService.getAllOrders();
            setOrders(resultOrders.data);
            setLoading(false);
        })();
    }, []);
    //xử lý khi chọn đơn hàng
    const handleOrder = async (orderId) => {
        setLoading(true);
        if (orderId !== -1) {
            setEntrySlipDetails([]);
            const resultOrder = await orderService.getOrder(orderId);
            if (resultOrder.data) {
                setSupplierId(resultOrder.data.supplierId);
                form.setFieldsValue({
                    supplierName: resultOrder.data.supplierName,
                });
            }
            const resultOrderDetails = await orderDetailService.getOrderDetailsByOrderId(orderId);

            const idShipments = resultOrderDetails.data.reduce(
                (arr, item) => (arr.includes(item.shipmentId) ? arr : [...arr, item.shipmentId]),
                [],
            );
            const resultShipments = await shipmentService.getShipmentsByIds(idShipments);
            setShipments(resultShipments.data);
        } else {
            setShipments([]);
            form.setFieldsValue({
                supplierName: '',
                shipmentId: -1,
                vaccineName: '',
                vaccineId: 0,
                price: 0,
            });
        }
        setLoading(false);
    };
    //xử lý khi chọn lô
    const handleShipment = (shipmentId) => {
        (async () => {
            form.setFieldsValue({
                vaccineId: -1,
                price: '',
            });
            setLoading(true);
            if (shipmentId !== -1) {
                const resultVaccine = await vaccineService.getVaccineByShipmentId(shipmentId);
                form.setFieldsValue({
                    vaccineId: resultVaccine.data.id,
                    vaccineName: resultVaccine.data.name,
                });
                const orderDetail = await orderDetailService.getOrderDetailsByOrderIdVaccineIdShipmentId(
                    form.getFieldValue('orderId'),
                    resultVaccine.data.id,
                    shipmentId,
                );
                form.setFieldsValue({
                    price: orderDetail.data.price,
                });
            } else {
                form.setFieldsValue({
                    vaccineId: 0,
                    vaccineName: '',
                    price: 0,
                });
            }
            setLoading(false);
        })();
    };
    //lưu vào db
    const onSave = async () => {
        setLoading(true);
        //id nv đăng nhập
        const staffId = JSON.parse(Cookies.get(configStorage.login)).user.staffId;
        //thêm phiêeus nhập
        const res = await entrySlipService.insertEntrySlip({
            orderId: form.getFieldValue('orderId'),
            supplierId,
            staffId,
        });
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi thêm phiếu nhập.',
                duration: 3,
            });
        else if (res.isSuccess) {
            notification.success({
                message: 'Thành công',
                description: res.messages[0],
                duration: 3,
            });
            //ds chi tiết phiếu nhâập
            const listEntrySlipDetails = entrySlipDetails.map((entrySlipDetail) => ({
                entrySlipId: res.data.id,
                vaccineId: entrySlipDetail.vaccineId,
                shipmentId: entrySlipDetail.shipmentId,
                number: entrySlipDetail.number,
                price: entrySlipDetail.price,
            }));
            //them chi tiết phiếu nhập
            const resultEntrySlipDetails = await entrySlipDetailService.insertEntrySlipDetailsRange(
                listEntrySlipDetails,
            );
            if (resultEntrySlipDetails.status === 500)
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi thêm phiếu nhập.',
                    duration: 3,
                });
            else if (resultEntrySlipDetails.isSuccess) {
                const resultUpdateStatus = await orderService.updateOrderStatus(form.getFieldValue('orderId'));
                //chuyển trang manger entrySlip
                history(configRoutes.entrySlip);
                if (resultUpdateStatus.isSuccess) {
                    notification.success({
                        message: 'Thành công',
                        description: resultEntrySlipDetails.messages[0],
                        duration: 3,
                    });
                }
            } else
                notification.error({
                    message: 'Lỗi',
                    description: resultEntrySlipDetails.messages[0],
                    duration: 3,
                });
        } else
            notification.error({
                message: 'Lỗi',
                description: res.messages[0],
                duration: 3,
            });
        setLoading(false);
    };
    //xử lý khi thêm
    const onFinish = (params) => {
        (async () => {
            setLoading(true);
            delete params.supplierId;
            //kiểm tra có trong chi tiết đơn hàng chưa
            const entrySlipDetail = entrySlipDetails.find(
                (entrySlipDetail) =>
                    entrySlipDetail.shipmentId === params.shipmentId && entrySlipDetail.vaccineId === params.vaccineId,
            );
            //lấy chi tiết đơn hàng theo id đơn hàng
            const resultOrderDetails = (await orderDetailService.getOrderDetailsByOrderId(params.orderId)).data;
            //lấy ds phiếu nhập theo id đơn hàng
            const resultEntrySlipsByOrderId = (await entrySlipService.getEntrySlipsByOrderId(params.orderId)).data;
            //danh id phiếu nhập
            const entrySlipIds = resultEntrySlipsByOrderId.map((item) => item.id);
            //lấy ds chi tiết phiếu nhập theo list id phiếu nhập
            const resultEntrySlipDetailsByEntrySlipIds = (
                await entrySlipDetailService.getEntrySlipDetailsByEntrySlipIds(entrySlipIds)
            ).data;
            //có r thì update sl
            if (entrySlipDetail) {
                //lấy r chi tiết đơn hàng theo id lô, vaccine
                const orderDetail = resultOrderDetails.find(
                    (item) =>
                        item.shipmentId === entrySlipDetail.shipmentId && item.vaccineId === entrySlipDetail.vaccineId,
                );
                //tính tổng số lượng trong chi tiết phiếu nhập trên giao diện và chuẩn bị thêm và số lượng chi tiếst phieeus nhập trong db(đã nhập)
                const numberEntrySlipDetail =
                    Number(entrySlipDetail.number) +
                    Number(params.number) +
                    Number(
                        resultEntrySlipDetailsByEntrySlipIds
                            .filter(
                                (item) => item.shipmentId === params.shipmentId && item.vaccineId === params.vaccineId,
                            )
                            .reduce((sum, item) => sum + item.number, 0),
                    );
                //so sánh sl đặt vs sl đã nhập và chuẩn bị nhập
                if (orderDetail.number >= numberEntrySlipDetail) {
                    entrySlipDetail.number = Number(entrySlipDetail.number) + Number(params.number);
                    entrySlipDetail.total = entrySlipDetail.number * entrySlipDetail.price;
                } else {
                    notification.warning({
                        message: 'Cảnh báo',
                        description: 'Không được vượt quá số lượng trong phiếu đặt hàng.',
                        duration: 3,
                    });
                }
                //chưa có thì thêm
            } else {
                //giống ở trên
                const orderDetail = resultOrderDetails.find(
                    (item) => item.shipmentId === params.shipmentId && item.vaccineId === params.vaccineId,
                );
                const numberEntrySlipDetail =
                    Number(params.number) +
                    Number(
                        resultEntrySlipDetailsByEntrySlipIds
                            .filter(
                                (item) => item.shipmentId === params.shipmentId && item.vaccineId === params.vaccineId,
                            )
                            .reduce((sum, item) => sum + item.number, 0),
                    );
                if (orderDetail.number >= numberEntrySlipDetail) {
                    const vaccine = await vaccineService.getVaccine(params.vaccineId);
                    params.vaccineName = vaccine.data.name;
                    const shipment = await shipmentService.getShipment(params.shipmentId);
                    params.shipmentCode = shipment.data.shipmentCode;
                    params.total = params.price * params.number;
                    params.id = entrySlipDetails.length + 1;
                    setEntrySlipDetails((pre) => [...pre, params]);
                } else {
                    notification.warning({
                        message: 'Cảnh báo',
                        description: 'Không được vượt quá số lượng trong phiếu đặt hàng.',
                        duration: 3,
                    });
                }
            }
            setLoading(false);
        })();
    };
    //xử lý khi xem chi tiết
    const handleDetailShipment = async () => {
        await readDetail(form, 'shipmentId', setLoading, 'shipment', setDataModalShipment, setOpenModalShipment);
    };
    const handleDetailOrder = async () => {
        await readDetail(form, 'orderId', setLoading, 'order', setDataModalOrder, setOpenModalOrder);
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
                open={openModalOrder}
                setOpen={setOpenModalOrder}
                data={dataModalOrder}
                title="Thông tin phiếu đặt"
            />
            <Head title={`${configTitle.add} ${configTitle.entrySlip.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm phiếu nhập</TitleAddUpdate>
                    <Col span={24}>
                        <Form
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
                            form={form}
                        >
                            <Row gutter={[16, 0]}>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Phiếu đặt hàng"
                                        name="orderId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn phiếu đặt hàng') : cb(),
                                                message: 'Vui lòng chọn phiếu đặt hàng',
                                            },
                                        ]}
                                        initialValue={-1}
                                    >
                                        <Select
                                            suffixIcon={<InfoCircleOutlined onClick={handleDetailOrder} />}
                                            onChange={handleOrder}
                                        >
                                            <Select.Option value={-1}>Chọn phiếu đặt hàng</Select.Option>
                                            {orders.map((order) => (
                                                <Select.Option key={order.id} value={order.id}>
                                                    {order.id}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Nhà cung cấp"
                                        name="supplierName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn phiếu đặt hàng để hiển thị nhà cung cấp.',
                                            },
                                        ]}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Lô vaccine"
                                        name="shipmentId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn lô vaccine') : cb(),
                                                message: 'Vui lòng chọn lô vaccine',
                                            },
                                        ]}
                                        initialValue={-1}
                                    >
                                        <Select
                                            suffixIcon={<InfoCircleOutlined onClick={handleDetailShipment} />}
                                            onChange={handleShipment}
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
                                <Col hidden span={24} sm={{ span: 12 }}>
                                    <Form.Item label="Vaccine" name="vaccineId">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Vaccine"
                                        name="vaccineName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn lô hàng để hiện thị vaccine.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1
                                                        ? cb('Vui lòng chọn lô hàng để hiện thị vaccine.')
                                                        : cb(),
                                                message: 'Vui lòng chọn lô hàng để hiện thị vaccine.',
                                            },
                                        ]}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Giá đặt"
                                        name="price"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn vaccine để hiển thị giá.',
                                            },
                                        ]}
                                        initialValue={0}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Số lượng"
                                        name="number"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập số lượng.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Số lượng không được nhỏ hơn hoặc bằng 0.') : cb(),
                                                message: 'Số lượng không được nhỏ hơn hoặc bằng 0.',
                                            },
                                        ]}
                                        initialValue={1}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="">
                                        <Button className="ml-2" type="primary" htmlType="submit">
                                            Thêm
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col span={24}>
                        <Col span={24}>
                            <AddEntrySlipDetail
                                setEntrySlipDetails={setEntrySlipDetails}
                                entrySlipDetails={entrySlipDetails}
                            />
                        </Col>
                        <Col className="mt-4" span={24}>
                            <Form.Item>
                                <Link to={configRoutes.entrySlip}>
                                    <Button type="dashed">Trở lại</Button>
                                </Link>
                                <Button onClick={onSave} className="ml-2" type="primary">
                                    Lưu
                                </Button>
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>
            </Spin>
        </>
    );
};
export default Add;

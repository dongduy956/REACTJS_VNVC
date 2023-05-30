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
    orderDetailService,
    orderService,
    shipmentService,
    supplierService,
    vaccinePriceService,
    vaccineService,
} from '~/services';
import { readDetail } from '~/utils';
import AddOrderDetail from '../../components/AddOrderDetail';
const Add = () => {
    useAuth();
    const [form] = Form.useForm();
    const history = useNavigate();
    //data modal xem chi tiết
    const [dataModalShipment, setDataModalShipment] = useState({});
    const [openModalShipment, setOpenModalShipment] = useState(false);
    const [dataModalSupplier, setDataModalSupplier] = useState({});
    const [openModalSupplier, setOpenModalSupplier] = useState(false);
    const [loading, setLoading] = useState(false);
    //data combobox nhà cung cấp
    const [suppliers, setSuppliers] = useState([]);
    //data combobox lô hàng
    const [shipments, setShipments] = useState([]);
    //data combobox chi tiết đặt hàng
    const [orderDetails, setOrderDetails] = useState([]);
    //id nhà cung cấp
    const [supplierId, setSupplierId] = useState(-1);
    //chỉ chạy lần đầu load trang
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultSuppliers = await supplierService.getAllSuppliers();
            setSuppliers(resultSuppliers.data);
            setLoading(false);
        })();
    }, []);
    //xử lý khi chọn 1 nhà cung cấp
    const handleSupplier = (supplierId) => {
        (async () => {
            setSupplierId(supplierId);
            setOrderDetails([]);
            form.setFieldsValue({
                vaccineId: 0,
                shipmentId: -1,
                vaccineName: '',
                price: 0,
            });
            setLoading(true);
            const resultShipments = await shipmentService.getShipmentsBySupplierId(supplierId);
            setShipments(resultShipments.data);
            setLoading(false);
        })();
    };
    //xử lý khi chọn 1 lô hàng
    const handleShipment = (shipmentId) => {
        (async () => {
            form.setFieldsValue({
                vaccineId: 0,
                vaccineName: '',
                price: 0,
            });
            setLoading(true);
            const resultVaccine = await vaccineService.getVaccineByShipmentId(shipmentId);
            if (resultVaccine.isSuccess) {
                const vaccinePrice = await vaccinePriceService.getVaccinePriceLastByVaccineIdAndShipmentId(
                    resultVaccine.data.id,
                    shipmentId,
                );
                if (vaccinePrice.isSuccess)
                    form.setFieldsValue({
                        price: vaccinePrice.data.entryPrice,
                    });
                form.setFieldsValue({
                    vaccineId: resultVaccine.data.id,
                    vaccineName: resultVaccine.data.name,
                });
            } else {
                form.setFieldsValue({
                    price: 0,
                    vaccineId: 0,
                    vaccineName: resultVaccine.data.name,
                });
            }
            setLoading(false);
        })();
    };
    //xử lý lưu đơn hàng và chi tiết đặt hàng vàof db
    const onSave = async () => {
        setLoading(true);
        //lấy id nv đang đăng nhập
        const staffId = JSON.parse(Cookies.get(configStorage.login)).user.staffId;
        //thêm đơn hàng vào db
        const res = await orderService.insertOrder({
            supplierId,
            staffId,
        });
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi thêm phiếu đặt hàng.',
                duration: 3,
            });
        else if (res.isSuccess) {
            notification.success({
                message: 'Thành công',
                description: res.messages[0],
                duration: 3,
            });
            //tạo ds chi tiết đơn hàng để lưu db
            const listOrderDetails = orderDetails.map((orderDetail) => ({
                orderId: res.data.id,
                vaccineId: orderDetail.vaccineId,
                shipmentId: orderDetail.shipmentId,
                number: orderDetail.number,
                price: orderDetail.price,
            }));
            //lưu chi tiết đơn hàng vào db
            const resultOrderDetails = await orderDetailService.insertOrderDetailsRange(listOrderDetails);
            if (resultOrderDetails.status === 500)
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi thêm phiếu đặt hàng.',
                    duration: 3,
                });
            else if (resultOrderDetails.isSuccess) {
                //chuyển trang manger order
                history(configRoutes.order);
                notification.success({
                    message: 'Thành công',
                    description: resultOrderDetails.messages[0],
                    duration: 3,
                });
            } else
                notification.error({
                    message: 'Lỗi',
                    description: resultOrderDetails.messages[0],
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
    //xử lý khi thêm 1 vaccine vào chi tiết đặt hàng (chưa lưu db)
    const onFinish = (params) => {
        (async () => {
            setLoading(true);
            delete params.supplierId;
            //kiểm tra có trong chi tiết chưa
            const orderDetail = orderDetails.find(
                (orderDetail) =>
                    orderDetail.shipmentId === params.shipmentId && orderDetail.vaccineId === params.vaccineId,
            );
            //có rồi update cộng thêm số lượng
            if (orderDetail) {
                orderDetail.number = Number(orderDetail.number) + Number(params.number);
                orderDetail.total = orderDetail.number * orderDetail.price;
                const newOrderDetails = orderDetails.map((item) => (item.id === orderDetail.id ? orderDetail : item));
                setOrderDetails(newOrderDetails);
                //chưa có thêm vào
            } else {
                const vaccine = await vaccineService.getVaccine(params.vaccineId);
                params.vaccineName = vaccine.data.name;
                const shipment = await shipmentService.getShipment(params.shipmentId);
                params.shipmentCode = shipment.data.shipmentCode;
                params.total = params.price * params.number;
                params.id = orderDetails.length + 1;

                setOrderDetails((pre) => [...pre, params]);
            }
            setLoading(false);
        })();
    };
    //xử lý lấy thông tin xem chi tiết
    const handleDetailSupplier = async () => {
        await readDetail(form, 'supplierId', setLoading, 'supplier', setDataModalSupplier, setOpenModalSupplier);
    };
    const handleDetailShipment = async () => {
        await readDetail(form, 'shipmentId', setLoading, 'shipment', setDataModalShipment, setOpenModalShipment);
    };
    return (
        <>
            <Modal
                open={openModalSupplier}
                setOpen={setOpenModalSupplier}
                data={dataModalSupplier}
                title="Thông tin nhà cung cấp"
            />
            <Modal
                open={openModalShipment}
                setOpen={setOpenModalShipment}
                data={dataModalShipment}
                title="Thông tin lô vaccine"
            />
            <Head title={`${configTitle.add} ${configTitle.order.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm phiếu đặt hàng</TitleAddUpdate>
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
                                        label="Nhà cung cấp"
                                        name="supplierId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn nhà cung cấp') : cb(),
                                                message: 'Vui lòng chọn nhà cung cấp',
                                            },
                                        ]}
                                        initialValue={-1}
                                    >
                                        <Select
                                            suffixIcon={<InfoCircleOutlined onClick={handleDetailSupplier} />}
                                            onChange={handleSupplier}
                                        >
                                            <Select.Option value={-1}>Chọn nhà cung cấp</Select.Option>
                                            {suppliers.map((supplier) => (
                                                <Select.Option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
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
                                    <Form.Item
                                        label="Vaccine"
                                        name="vaccineId"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn lô hàng để hiên thị vaccine.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1
                                                        ? cb('Vui lòng chọn lô hàng để hiên thị vaccine.')
                                                        : cb(),
                                                message: 'Vui lòng chọn lô hàng để hiên thị vaccine.',
                                            },
                                        ]}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Vaccine"
                                        name="vaccineName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn lô hàng để hiên thị vaccine.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1
                                                        ? cb('Vui lòng chọn lô hàng để hiên thị vaccine.')
                                                        : cb(),
                                                message: 'Vui lòng chọn lô hàng để hiên thị vaccine.',
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
                                                message: 'Vui lòng chọn lô hàng để hiển thị giá vaccine của lô.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0
                                                        ? cb('Vui lòng chọn lô hàng để hiển thị giá vaccine của lô.')
                                                        : cb(),
                                                message: 'Vui lòng chọn lô hàng để hiển thị giá vaccine của lô.',
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
                            <AddOrderDetail setOrderDetails={setOrderDetails} orderDetails={orderDetails} />
                        </Col>
                        <Col className="mt-4" span={24}>
                            <Form.Item>
                                <Link to={configRoutes.order}>
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

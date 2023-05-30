import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, notification, Row, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { shipmentService, vaccinePriceService, vaccineService } from '~/services';
import { readDetail } from '~/utils';
const Update = () => {
    useAuth();
    const [dataModalVaccine, setDataModalVaccine] = useState({});
    const [openModalVaccine, setOpenModalVaccine] = useState(false);
    const [dataModalShipment, setDataModalShipment] = useState({});
    const [openModalShipment, setOpenModalShipment] = useState(false);
    const [form] = Form.useForm();
    const { state } = useLocation();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);

    const [shipments, setShipments] = useState([]);
    const [vaccines, setVaccines] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultVaccines = await vaccineService.getAllVaccines();
            setVaccines(resultVaccines.data);
            const resultShipments = (await shipmentService.getShipmentsByVaccineId(state.vaccineId)).data;
            setShipments(resultShipments);
            setLoading(false);
        })();
    }, []);
    const handleVaccine = async (vaccineId) => {
        form.setFieldValue('shipmentId', -1);
        setLoading(true);
        const resultShipments = (await shipmentService.getShipmentsByVaccineId(vaccineId)).data;
        setShipments(resultShipments);
        setLoading(false);
    };
    const fetchData = async (params) => {
        setLoading(true);
        const res = await vaccinePriceService.updateVaccinePrice(params);
        setLoading(false);

        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi cập nhật giá vaccine.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.vaccinePrice);
            notification.success({
                message: 'Thành công',
                description: res.messages[0],
                duration: 3,
            });
        } else
            notification.error({
                message: 'Lỗi',
                description: res.messages[0],
                duration: 3,
            });
    };
    const onFinish = (params) => {
        fetchData(params);
    };
    const handleDetailShipment = async () => {
        await readDetail(form, 'shipmentId', setLoading, 'shipment', setDataModalShipment, setOpenModalShipment);
    };
    const handleDetailVaccine = async () => {
        await readDetail(form, 'vaccineId', setLoading, 'vaccine', setDataModalVaccine, setOpenModalVaccine);
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
            <Head title={`${configTitle.update} ${configTitle.vaccinePrice.toLowerCase()} ${state.id}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Sửa giá vaccine {state.vaccineName}</TitleAddUpdate>
                    <Col span={24}>
                        <Form
                            form={form}
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
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        initialValue={state.vaccineId}
                                        labelCol={{ span: 5 }}
                                        label="Vaccine"
                                        name="vaccineId"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn vaccine',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn vaccine') : cb(),
                                                message: 'Vui lòng chọn vaccine',
                                            },
                                        ]}
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
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        initialValue={state.shipmentId}
                                        labelCol={{ span: 5 }}
                                        label="Vaccine"
                                        name="shipmentId"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn lô hàng',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn lô vaccine') : cb(),
                                                message: 'Vui lòng chọn lô vaccine',
                                            },
                                        ]}
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

                                <Col span={16} offset={4}>
                                    <Form.Item
                                        initialValue={state.entryPrice}
                                        labelCol={{ span: 5 }}
                                        label="Giá nhập"
                                        name="entryPrice"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập giá nhập.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Giá nhập không được nhỏ hơn 0.') : cb(),
                                                message: 'Giá nhập không được nhỏ hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        initialValue={state.retailPrice}
                                        labelCol={{ span: 5 }}
                                        label="Giá bán lẻ"
                                        name="retailPrice"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập giá bán lẻ.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Giá bán lẻ không được nhỏ hơn 0.') : cb(),
                                                message: 'Giá bán lẻ không được nhỏ hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        initialValue={state.preOderPrice}
                                        labelCol={{ span: 5 }}
                                        label="Giá đặt trước"
                                        name="preOderPrice"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập giá đặt trước.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Giá đặt trước không được nhỏ hơn 0.') : cb(),
                                                message: 'Giá đặt trước không được nhỏ hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>

                                <Col span={16} offset={4}>
                                    <Form.Item>
                                        <Link to={configRoutes.vaccinePrice}>
                                            <Button type="dashed">Trở lại</Button>
                                        </Link>
                                        <Button className="ml-2" type="primary" htmlType="submit">
                                            Sửa
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Spin>
        </>
    );
};
export default Update;

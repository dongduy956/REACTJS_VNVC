import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, notification, Row, Select, Spin } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { defaultUTC } from '~/constraints';
import { useAuth } from '~/hooks';
import { shipmentService, supplierService, vaccineService } from '~/services';
import { readDetail } from '~/utils';
const { RangePicker } = DatePicker;
const Add = () => {
    useAuth();
    const [dataModalVaccine, setDataModalVaccine] = useState({});
    const [openModalVaccine, setOpenModalVaccine] = useState(false);
    const [dataModalSupplier, setDataModalSupplier] = useState({});
    const [openModalSupplier, setOpenModalSupplier] = useState(false);
    const [form] = Form.useForm();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    //get suppliers

    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultShipments = await supplierService.getAllSuppliers();
            setSuppliers(resultShipments.data);
            const resultVaccines = await vaccineService.getAllVaccines();
            setVaccines(resultVaccines.data);
            setLoading(false);
        })();
    }, []);

    const fetchData = async (params) => {
        setLoading(true);
        const shipments = (await shipmentService.getAllShipments()).data;
        if (shipments.find((x) => x.shipmentCode.toLowerCase().trim() === params.shipmentCode.toLowerCase().trim()))
            notification.warning({
                message: 'Cảnh báo',
                description: 'Trùng mã lô vaccine.',
                duration: 3,
            });
        else {
            const res = await shipmentService.insertShipment(params);
            if (res.status === 500)
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi thêm lô hàng.',
                    duration: 3,
                });
            else if (res.isSuccess) {
                history(configRoutes.shipment);
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
        }
        setLoading(false);
    };
    const onFinish = (params) => {
        let manufactureDate = new Date(params.dates[0].format());
        manufactureDate = new Date(
            manufactureDate.setHours(manufactureDate.getHours() + defaultUTC.hours),
        ).toISOString();
        let expirationDate = new Date(params.dates[1].format());
        expirationDate = new Date(expirationDate.setHours(expirationDate.getHours() + defaultUTC.hours)).toISOString();
        params.manufactureDate = manufactureDate;
        params.expirationDate = expirationDate;
        delete params.dates;
        fetchData(params);
    };
    const handleSupplier = (supplierId) => {
        const supplier = suppliers.find((supplier) => supplier.id === supplierId);
        if (supplier) form.setFieldValue('country', supplier.address);
    };
    const handleDetailSupplier = async () => {
        await readDetail(form, 'supplierId', setLoading, 'supplier', setDataModalSupplier, setOpenModalSupplier);
    };
    const handleDetailVaccine = async () => {
        await readDetail(form, 'vaccineId', setLoading, 'vaccine', setDataModalVaccine, setOpenModalVaccine);
    };
    return (
        <>
            <Modal
                open={openModalVaccine}
                setOpen={setOpenModalVaccine}
                data={dataModalVaccine}
                title="Thông tin vaccine"
            />
            <Modal
                open={openModalSupplier}
                setOpen={setOpenModalSupplier}
                data={dataModalSupplier}
                title="Thông tin nhà cung cấp"
            />
            <Head title={`${configTitle.add} ${configTitle.shipment.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm lô vaccine</TitleAddUpdate>
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
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        label="Mã lô"
                                        name="shipmentCode"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ mã lô.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
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
                                            <Select value={-1}>Chọn nhà cung cấp</Select>
                                            {suppliers.map((supplier) => (
                                                <Select.Option key={supplier.id} value={supplier.id}>
                                                    {supplier.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        label="Vaccine"
                                        name="vaccineId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn vaccine') : cb(),
                                                message: 'Vui lòng chọn vaccine',
                                            },
                                        ]}
                                        initialValue={-1}
                                    >
                                        <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailVaccine} />}>
                                            <Select value={-1}>Chọn vaccine</Select>
                                            {vaccines.map((vaccine) => (
                                                <Select.Option key={vaccine.id} value={vaccine.id}>
                                                    {vaccine.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={[
                                            moment(new Date(), 'dd/MM/yyyy'),
                                            moment(new Date(), 'dd/MM/yyyy'),
                                        ]}
                                        name="dates"
                                        label="Ngày"
                                        rules={[
                                            {
                                                type: 'array',
                                                required: true,
                                                message: 'Vui lòng chọn ngày!',
                                            },
                                            {
                                                validator: (rule, values, cb) =>
                                                    new Date(values[0].format()) >= new Date()
                                                        ? cb('Ngày sản xuất không được lớn hơn ngày hiện tại.')
                                                        : cb(),
                                                message: 'Ngày sản xuất không được lớn hơn ngày hiện tại.',
                                            },
                                        ]}
                                    >
                                        <RangePicker
                                            showTime
                                            className="w-full"
                                            placeholder={['Ngày sản xuất', 'Ngày hết hạn']}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        name="country"
                                        label="Quốc gia"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn nhà cung cấp để hiển thị quốc gia',
                                            },
                                        ]}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label=" ">
                                        <Link to={configRoutes.shipment}>
                                            <Button type="dashed">Trở lại</Button>
                                        </Link>
                                        <Button className="ml-2" type="primary" htmlType="submit">
                                            Thêm
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
export default Add;

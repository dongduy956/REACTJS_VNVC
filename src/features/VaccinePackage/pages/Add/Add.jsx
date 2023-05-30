import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, notification, Row, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import {
    regulationInjectionService,
    shipmentService,
    vaccinePackageDetailService,
    vaccinePackageService,
    vaccineService,
} from '~/services';
import { readDetail } from '~/utils';
import AddVaccinePackageDetail from '../../components/AddVaccinePackageDetail';
const Add = () => {
    useAuth();
    const [dataModalVaccine, setDataModalVaccine] = useState({});
    const [openModalVaccine, setOpenModalVaccine] = useState(false);
    const [dataModalShipment, setDataModalShipment] = useState({});
    const [openModalShipment, setOpenModalShipment] = useState(false);
    const [form] = Form.useForm();
    const [formVaccinePackage] = Form.useForm();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [shipments, setShipments] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [isGeneral, setIsGeneral] = useState(false);
    const [vaccinePackageDetails, setVaccinePackageDetails] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultVaccines = (await vaccineService.getAllVaccines()).data;

            setVaccines(resultVaccines);
            setLoading(false);
        })();
    }, []);
    const onFinish = (params) => {
        params.isGeneral = isGeneral;
        params.vaccineName = vaccines.find((x) => x.id === params.vaccineId).name;
        params.shipmentCode = shipments.find((x) => x.id === params.shipmentId).shipmentCode;
        let newData = [...vaccinePackageDetails];
        if (newData.find((item) => item.shipmentId !== params.shipmentId && item.vaccineId === params.vaccineId))
            notification.warn({
                message: 'Cảnh báo',
                description: 'Đã có vaccine này rồi',
                duration: 3,
            });
        else {
            const vaccinePackageDetail = newData.find((item) => item.shipmentId === params.shipmentId);
            if (vaccinePackageDetail)
                vaccinePackageDetail.numberOfInjections =
                    Number(vaccinePackageDetail.numberOfInjections) + Number(params.numberOfInjections);
            else newData.push(params);
            newData = newData.map((item, index) => ({ ...item, id: index + 1 }));
        }

        setVaccinePackageDetails(newData);
    };
    const handleVaccine = async (vaccineId) => {
        setLoading(true);
        form.setFieldValue('shipmentId', -1);
        const resultShipments = (await shipmentService.getShipmentsByVaccineId(vaccineId)).data;
        setShipments(resultShipments);
        const resultRegulationInjection = await regulationInjectionService.getRegulationInjectionByVaccineId(vaccineId);
        if (resultRegulationInjection.isSuccess)
            form.setFieldValue('orderInjection', resultRegulationInjection.data.order);
        setLoading(false);
    };
    const handleIsGeneral = (e) => setIsGeneral(e.target.checked);
    const onFinishAll = async (params) => {
        if (vaccinePackageDetails.length === 0)
            notification.warn({
                message: 'Cảnh báo',
                description: 'Gói phải có ít nhất 1 vaccine.',
                duration: 3,
            });
        else {
            setLoading(true);
            const vaccinePackages = (await vaccinePackageService.getAllVaccinePackages()).data;
            if (vaccinePackages.find((x) => x.name.trim().toLowerCase() === params.name.toLowerCase().trim()))
                notification.warn({
                    message: 'Cảnh báo',
                    description: 'Trùng tên gói vaccine.',
                    duration: 3,
                });
            else {
                const resultInsertVaccinePackage = await vaccinePackageService.insertVaccinePackage(params);
                if (resultInsertVaccinePackage.isSuccess) {
                    const listVaccinePackageDetails = vaccinePackageDetails.map((item) => ({
                        vaccineId: item.vaccineId,
                        shipmentId: item.shipmentId,
                        orderInjection: item.orderInjection,
                        numberOfInjections: item.numberOfInjections,
                        vaccinePackageId: resultInsertVaccinePackage.data.id,
                        isGeneral: item.isGeneral,
                    }));
                    const resultInsertPackageDetail =
                        await vaccinePackageDetailService.insertVaccinePackageDetailsRange(listVaccinePackageDetails);
                    if (resultInsertPackageDetail.isSuccess) {
                        notification.success({
                            message: 'Thành công',
                            description: resultInsertVaccinePackage.messages[0],
                            duration: 3,
                        });
                        history(configRoutes.vaccinePackage);
                    }
                }
            }
            setLoading(false);
        }
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
            <Head title={`${configTitle.add} ${configTitle.vaccinePackage.toLowerCase()}`} />
            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm gói vaccine</TitleAddUpdate>
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
                                        label="Vaccine"
                                        name="vaccineId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn vaccine.') : cb(),
                                                message: 'Vui lòng chọn vaccine.',
                                            },
                                        ]}
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
                                        name="orderInjection"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0
                                                        ? cb('Vui lòng chọn vaccine để hiển thị thứ tự tiêm.')
                                                        : cb(),
                                                message: 'Vui lòng chọn vaccine để hiển thị thứ tự tiêm.',
                                            },
                                        ]}
                                        initialValue={0}
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
                                                message: 'Vui lòng nhập số lượng mũi tiêm.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0
                                                        ? cb('Số lượng mũi tiêm không được nhỏ hơn hoặc bằng 0.')
                                                        : cb(),
                                                message: 'Số lượng mũi tiêm không được nhỏ hơn hoặc bằng 0.',
                                            },
                                        ]}
                                        initialValue={1}
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
                                    <Form.Item label="">
                                        <Button type="primary" htmlType="submit">
                                            Thêm
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col span={24}>
                        <AddVaccinePackageDetail
                            setVaccinePackageDetails={setVaccinePackageDetails}
                            vaccinePackageDetails={vaccinePackageDetails}
                        />
                    </Col>
                    <Col span={24} className="mt-4">
                        <Form
                            name="wrap"
                            labelCol={{
                                flex: '150px',
                            }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{
                                flex: 1,
                            }}
                            colon={false}
                            onFinish={onFinishAll}
                            form={formVaccinePackage}
                        >
                            <Row gutter={[16, 0]}>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Tên gói vaccine"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập tên gói vaccine.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Đối tượng tiêm"
                                        name="objectInjection"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đối tượng tiêm.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col className="mt-4" span={24}>
                                    <Form.Item>
                                        <Link to={configRoutes.vaccinePackage}>
                                            <Button type="dashed">Trở lại</Button>
                                        </Link>
                                        <Button className="ml-2" htmlType="submit" type="primary">
                                            Lưu
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

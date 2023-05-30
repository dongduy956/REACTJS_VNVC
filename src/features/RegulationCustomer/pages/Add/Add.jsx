import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, notification, Row, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { customerTypeService, regulationCustomerService, vaccineService } from '~/services';
import { dataModal, readDetail } from '~/utils';
const Add = () => {
    useAuth();
    const [form] = Form.useForm();
    const [dataModalVaccine, setDataModalVaccine] = useState({});
    const [openModalVaccine, setOpenModalVaccine] = useState(false);
    const [dataModalCustomerType, setDataModalCustomerType] = useState({});
    const [openModalCustomerType, setOpenModalCustomerType] = useState(false);
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [customerTypes, setCustomerTypes] = useState([]);
    const [vaccines, setVaccines] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultVaccines = await vaccineService.getAllVaccines();
            setVaccines(resultVaccines.data);
            const resultCustomerTypes = await customerTypeService.getAllCustomerTypes();
            setCustomerTypes(resultCustomerTypes.data);
            setLoading(false);
        })();
    }, []);

    const fetchData = async (params) => {
        setLoading(true);
        const regulationCustomers = (await regulationCustomerService.getAllRegulationCustomers()).data;
        const regulationCustomer = regulationCustomers.find(
            (x) => x.vaccineId === params.vaccineId && x.customerTypeId === params.customerTypeId,
        );
        if (regulationCustomer)
            notification.error({
                message: 'Cảnh báo',
                description: 'Đã có quy định này rồi.',
                duration: 3,
            });
        else {
            const res = await regulationCustomerService.insertRegulationCustomer(params);
            if (res.status === 500)
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi thêm quy định khách hàng.',
                    duration: 3,
                });
            else if (res.isSuccess) {
                history(configRoutes.regulationCustomer);
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
        fetchData(params);
    };
    const handleDetailCustomerType = async () => {
        await readDetail(
            form,
            'customerTypeId',
            setLoading,
            'customerType',
            setDataModalCustomerType,
            setOpenModalCustomerType,
        );
    };

    const handleDetailVaccine = async () => {
        await readDetail(form, 'vaccineId', setLoading, 'vaccine', setDataModalVaccine, setOpenModalVaccine);
    };
    return (
        <>
            <Modal
                open={openModalCustomerType}
                setOpen={setOpenModalCustomerType}
                data={dataModalCustomerType}
                title="Thông tin loại khách hàng"
            />
            <Modal
                open={openModalVaccine}
                setOpen={setOpenModalVaccine}
                data={dataModalVaccine}
                title="Thông tin vaccine"
            />
            <Head title={`${configTitle.add} ${configTitle.regulationCustomer.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm quy định khách hàng</TitleAddUpdate>
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
                                        labelCol={{ span: 5 }}
                                        label="Vaccine"
                                        name="vaccineId"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn vaccine.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn vaccine.') : cb(),
                                                message: 'Vui lòng chọn vaccine.',
                                            },
                                        ]}
                                        initialValue={-1}
                                    >
                                        <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailVaccine} />}>
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
                                        labelCol={{ span: 5 }}
                                        label="Loại khách hàng"
                                        name="customerTypeId"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn loại khách hàng',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn loại khách hàng.') : cb(),
                                                message: 'Vui lòng chọn loại khách hàng.',
                                            },
                                        ]}
                                        initialValue={-1}
                                    >
                                        <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailCustomerType} />}>
                                            <Select.Option value={-1}>Chọn loại khách hàng</Select.Option>
                                            {customerTypes.map((customerType) => (
                                                <Select.Option key={customerType.id} value={customerType.id}>
                                                    {customerType.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        labelCol={{ span: 5 }}
                                        label="Liều lượng"
                                        name="amount"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập liều lượng.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Liều lượng không được nhỏ hơn bằng 0.') : cb(),
                                                message: 'Liều lượng không được nhỏ hơn bằng 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>

                                <Col span={16} offset={4}>
                                    <Form.Item>
                                        <Link to={configRoutes.regulationCustomer}>
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

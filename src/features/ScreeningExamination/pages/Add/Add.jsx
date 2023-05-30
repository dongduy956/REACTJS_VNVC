import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, notification, Row, Select, Spin } from 'antd';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configStorage, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { customerService, screeningExaminationService } from '~/services';
import { readDetail } from '~/utils';
const Add = () => {
    useAuth();   
    const [dataModalCustomer, setDataModalCustomer] = useState({});
    const [openModalCustomer, setOpenModalCustomer] = useState(false);
    const [form] = Form.useForm();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultCustomers = await customerService.getAllCustomers();
            setCustomers(resultCustomers.data);
            setLoading(false);
        })();
    }, []);

    const fetchData = async (params) => {
        setLoading(true);
        const res = await screeningExaminationService.insertScreeningExamination(params);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi thêm phiếu khám.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.screeningExamination);
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
        setLoading(false);
    };
    const onFinish = (params) => {
        params.isEligible = form.getFieldValue('isEligible') ? form.getFieldValue('isEligible') : false;
        params.staffId= JSON.parse(Cookies.get(configStorage.login)).user.staffId;
        fetchData(params);
    };
    const handleEligible = (e) => {
        form.setFieldValue('isEligible', e.target.checked);
    };
    const handleDetailCustomer = async () => {
        await readDetail(form, 'customerId', setLoading, 'customer', setDataModalCustomer, setOpenModalCustomer);
    };  
    return (
        <>
            <Modal
                open={openModalCustomer}
                setOpen={setOpenModalCustomer}
                data={dataModalCustomer}
                title="Thông tin khách hàng"
            />          
            <Head title={`${configTitle.add} ${configTitle.screeningExamination.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm phiếu khám</TitleAddUpdate>
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
                                        label="Khách hàng"
                                        name="customerId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn khách hàng.') : cb(),
                                                message: 'Vui lòng chọn khách hàng.',
                                            },
                                        ]}
                                        initialValue={-1}
                                    >
                                        <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailCustomer} />}>
                                            <Select.Option value={-1}>Chọn khách hàng</Select.Option>
                                            {customers.map((customer) => (
                                                <Select.Option key={customer.id} value={customer.id}>
                                                    {customer.firstName + ' ' + customer.lastName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>                               

                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        label="Chuẩn đoán"
                                        name="diagnostic"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập chuẩn đoán.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        label="Chiều cao"
                                        name="height"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập chiều cao.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Chiều cao phải lớn hơn 0.') : cb(),
                                                message: 'Chiều cao phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        label="Cân nặng"
                                        name="weight"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập cân nặng.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Cân nặng phải lớn hơn 0.') : cb(),
                                                message: 'Cân nặng phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        label="Nhiệt độ"
                                        name="temperature"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập nhiệt độ.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Nhiệt độ phải lớn hơn 0.') : cb(),
                                                message: 'Nhiệt độ phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        label="Nhịp tim"
                                        name="heartbeat"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập nhịp tim.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Nhip tim phải lớn hơn 0.') : cb(),
                                                message: 'Nhip tim phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        label="Huyết áp"
                                        name="bloodPressure"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập huyết áp.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Huyết áp phải lớn hơn 0.') : cb(),
                                                message: 'Huyết áp phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item label="Đủ điều kiện" name="isEligible">
                                        <Checkbox onChange={handleEligible} />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item label="Ghi chú" name="note">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label=" ">
                                        <Link to={configRoutes.screeningExamination}>
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

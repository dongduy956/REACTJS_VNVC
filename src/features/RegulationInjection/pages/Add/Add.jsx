import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, notification, Row, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { regulationInjectionService, vaccineService } from '~/services';
import { readDetail } from '~/utils';
const Add = () => {
    useAuth();
    const [form] = Form.useForm();
    const [dataModalVaccine, setDataModalVaccine] = useState({});
    const [openModalVaccine, setOpenModalVaccine] = useState(false);
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [vaccines, setVaccines] = useState([]);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultVaccines = await vaccineService.getAllVaccines();
            setVaccines(resultVaccines.data);
            setLoading(false);
        })();
    }, []);

    const fetchData = async (params) => {
        setLoading(true);
        const regulationInjections = (await regulationInjectionService.getAllRegulationInjections()).data;
        if (regulationInjections.find((x) => x.vaccineId === params.vaccineId))
            notification.error({
                message: 'Cảnh báo',
                description: 'Quy định vaccine này đã có.',
                duration: 3,
            });
        else {
            const res = await regulationInjectionService.insertRegulationInjection(params);
            if (res.status === 500)
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi thêm quy định tiêm.',
                    duration: 3,
                });
            else if (res.isSuccess) {
                history(configRoutes.regulationInjection);
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
            <Head title={`${configTitle.add} ${configTitle.regulationInjection.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm quy định tiêm</TitleAddUpdate>
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
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={-1}
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
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={0}
                                        label="Khoảng cách tiêm"
                                        name="distance"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập khoảng cách tiêm.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value < 0 ? cb('Khoảng cách tiêm phải lớn hoặc bằng 0.') : cb(),
                                                message: 'Khoảng cách tiêm phải lớn hoặc bằng 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={0}
                                        label="Tiêm nhắc lại"
                                        name="repeatInjection"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập tiêm nhắc lại.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value < -1 || value > 0
                                                        ? cb('Chỉ nhận 2 giá trị (0: không, -1: có).')
                                                        : cb(),
                                                message: 'Chỉ nhận 2 giá trị (0: không, -1: có).',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col sm={{ span: 12 }} span={24}>
                                    <Form.Item
                                        initialValue={1}
                                        label="Thứ tự tiêm"
                                        name="order"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập thứ tự tiêm.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Thứ tự tiêm phải lớn hơn 0.') : cb(),
                                                message: 'Thứ tự tiêm phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label=" ">
                                        <Link to={configRoutes.regulationInjection}>
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

import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Form, notification, Row, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import {
    conditionPromotionService,
    customerRankService,
    paymentMethodService,
    promotionService,
    vaccinePackageService,
    vaccineService,
} from '~/services';
import { dataModal, readDetail } from '~/utils';
const Add = () => {
    useAuth();
    const [form] = Form.useForm();
    const history = useNavigate();
    const [dataModalVaccine, setDataModalVaccine] = useState({});
    const [openModalVaccine, setOpenModalVaccine] = useState(false);
    const [dataModalCustomerRank, setDataModalCustomerRank] = useState({});
    const [openModalCustomerRank, setOpenModalCustomerRank] = useState(false);
    const [dataModalPromotion, setDataModalPromotion] = useState({});
    const [openModalPromotion, setOpenModalPromotion] = useState(false);
    const [dataModalVaccinePackage, setDataModalVaccinePackage] = useState({});
    const [openModalVaccinePackage, setOpenModalVaccinePackage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [vaccines, setVaccines] = useState([]);
    const [vaccinePackages, setVaccinePackages] = useState([]);
    const [customerRanks, setCustomerRanks] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultVaccinePackages = await vaccinePackageService.getAllVaccinePackages();
            setVaccinePackages(resultVaccinePackages.data);
            const resultVaccines = await vaccineService.getAllVaccines();
            setVaccines(resultVaccines.data);
            const resultCustomerRanks = await customerRankService.getAllCustomerRanks();
            setCustomerRanks(resultCustomerRanks.data);
            const resultPaymentMethods = await paymentMethodService.getAllPaymentMethods();
            setPaymentMethods(resultPaymentMethods.data);
            const resultPromotions = await promotionService.getAllPromotions();
            setPromotions(resultPromotions.data);
            setLoading(false);
        })();
    }, []);

    const fetchData = async (params) => {
        setLoading(true);
        const res = await conditionPromotionService.insertConditionPromotion(params);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi thêm điều kiện khuyến mãi thành công.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.conditionPromotion);
            notification.success({
                message: 'Thành công',
                description: res.messages[0],
                duration: 3,
            });
        } else {
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
    const handleDetailCustomerRank = async () => {
        await readDetail(
            form,
            'customerRankId',
            setLoading,
            'customerRank',
            setDataModalCustomerRank,
            setOpenModalCustomerRank,
        );
    };
    const handleDetailVaccine = async () => {
        await readDetail(form, 'vaccineId', setLoading, 'vaccine', setDataModalVaccine, setOpenModalVaccine);
    };
    const handleDetailVaccinePackage = async () => {
        await readDetail(
            form,
            'packageVaccineId',
            setLoading,
            'vaccinePackage',
            setDataModalVaccinePackage,
            setOpenModalVaccinePackage,
        );
    };
    const handleDetailPromotion = async () => {
        await readDetail(form, 'promotionId', setLoading, 'promotion', setDataModalPromotion, setOpenModalPromotion);
    };
    return (
        <>
            <Modal
                open={openModalPromotion}
                setOpen={setOpenModalPromotion}
                data={dataModalPromotion}
                title="Thông tin khuyến mãi"
            />
            <Modal
                open={openModalVaccinePackage}
                setOpen={setOpenModalVaccinePackage}
                data={dataModalVaccinePackage}
                title="Thông tin gói vaccine"
            />
            <Modal
                open={openModalCustomerRank}
                setOpen={setOpenModalCustomerRank}
                data={dataModalCustomerRank}
                title="Thông tin xếp loại khách hàng"
            />
            <Modal
                open={openModalVaccine}
                setOpen={setOpenModalVaccine}
                data={dataModalVaccine}
                title="Thông tin vaccine"
            />
            <Head title={`${configTitle.add} ${configTitle.conditionPromotion.toLowerCase()}`} />
            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm điều kiện khuyến mãi</TitleAddUpdate>
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
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn mã khuyến mãi.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn mã khuyến mãi.') : cb(),
                                                message: 'Vui lòng chọn mã khuyến mãi.',
                                            },
                                        ]}
                                        initialValue={-1}
                                        label="Mã khuyến mãi"
                                        name="promotionId"
                                    >
                                        <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailPromotion} />}>
                                            <Select.Option value={-1}>Chọn mã khuyến mãi</Select.Option>
                                            {promotions.map((promotion) => (
                                                <Select.Option key={promotion.id} value={promotion.id}>
                                                    {promotion.promotionCode}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        initialValue={null}
                                        labelCol={{ span: 5 }}
                                        label="Gói vaccine"
                                        name="packageVaccineId"
                                    >
                                        <Select
                                            suffixIcon={<InfoCircleOutlined onClick={handleDetailVaccinePackage} />}
                                        >
                                            <Select.Option value={null}>Chọn gói vaccine</Select.Option>

                                            {vaccinePackages.map((vaccinePackage) => (
                                                <Select.Option key={vaccinePackage.id} value={vaccinePackage.id}>
                                                    {vaccinePackage.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        initialValue={null}
                                        labelCol={{ span: 5 }}
                                        label="Vaccine"
                                        name="vaccineId"
                                    >
                                        <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailVaccine} />}>
                                            <Select.Option value={null}>Chọn vaccine</Select.Option>

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
                                        initialValue={null}
                                        labelCol={{ span: 5 }}
                                        label="Xếp loại khách hàng"
                                        name="customerRankId"
                                    >
                                        <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailCustomerRank} />}>
                                            <Select.Option value={null}>Chọn xếp loại khách hàng</Select.Option>

                                            {customerRanks.map((customerRank) => (
                                                <Select.Option key={customerRank.id} value={customerRank.id}>
                                                    {customerRank.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        initialValue={null}
                                        labelCol={{ span: 5 }}
                                        label="Phương thức thanh toán"
                                        name="paymentMethodId"
                                    >
                                        <Select>
                                            <Select.Option value={null}>Chọn phương thức thanh toán</Select.Option>

                                            {paymentMethods.map((paymentMethod) => (
                                                <Select.Option key={paymentMethod.id} value={paymentMethod.id}>
                                                    {paymentMethod.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item>
                                        <Link to={configRoutes.conditionPromotion}>
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

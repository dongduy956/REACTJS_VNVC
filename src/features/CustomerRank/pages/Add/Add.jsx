import { Breadcrumb, Button, Col, Form, Input, Row, Spin, notification } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { customerRankService } from '~/services';
const Add = () => {
    useAuth();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const fetchData = async (params) => {
        setLoading(true);
        const customerRanks = (await customerRankService.getAllCustomerRanks()).data;
        if (customerRanks.find((x) => x.name.toLowerCase().trim() === params.name.toLowerCase().trim()))
            notification.warning({
                message: 'Cảnh báo',
                description: 'Trùng tên xếp loại khách hàng.',
                duration: 3,
            });
        else {
            const res = await customerRankService.insertCustomerRank(params);
            if (res.status === 500)
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi thêm xếp loại khách hàng.',
                    duration: 3,
                });
            else if (res.isSuccess) {
                history(configRoutes.customerRank);
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
    const onFinish = (params) => fetchData(params);
    return (
        <>
            <Head title={`${configTitle.add} ${configTitle.customerRank.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm xếp loại khách hàng</TitleAddUpdate>
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
                        >
                            <Row gutter={[16, 0]}>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        labelCol={{ span: 7 }}
                                        label="Tên xếp loại khách hàng"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ tên xếp loại khách hàng".',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        labelCol={{ span: 7 }}
                                        label="Điểm"
                                        name="point"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập điểm.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Điểm phải lớn hơn 0.') : cb(),
                                                message: 'Điểm phải lớn hơn 0.',
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item>
                                        <Link to={configRoutes.customerRank}>
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

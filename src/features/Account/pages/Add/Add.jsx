import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, notification, Row, Select, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { useAuth } from '~/hooks';
import { customerService, loginService, staffService } from '~/services';
import { readDetail } from '~/utils';
const Add = () => {
    useAuth();
    const history = useNavigate();
    const [form] = Form.useForm();
    const [logins, setLogins] = useState([]);
    //data modal xem chi tiết
    const [openCustomer, setOpenCustomer] = useState(false);
    const [dataModalCustomer, setDataModalCustomer] = useState({});
    const [openStaff, setOpenStaff] = useState(false);
    const [dataModalStaff, setDataModalStaff] = useState({});
    const [loading, setLoading] = useState(false);
    //check nhân viên hay khách hàng
    const [checkType, setCheckType] = useState(false);
    //data nhân viên
    const [staffs, setStaffs] = useState(false);
    //data khách hàng
    const [customers, setCustomers] = useState(false);
    //chạy lần đầu và khi checktype thay đổi dữ liệuj
    useEffect(() => {
        (async () => {
            setLoading(true);
            //lấy data login
            const resultLogins = (await loginService.getAllLogins()).data;
            setLogins(resultLogins);
            if (checkType) {
                const staffs = (await staffService.getAllStaffs()).data.filter(
                    (x) => !resultLogins.some((y) => y.staffId && y.staffId === x.id),
                );
                setStaffs(staffs);
            } else {
                const customers = (await customerService.getAllCustomers()).data.filter(
                    (x) => !resultLogins.some((y) => y.customerId && y.customerId === x.id),
                );
                setCustomers(customers);
            }
            setLoading(false);
        })();
    }, [checkType]);
    const handleCheckType = (e) => {
        //gán lại checkbox true hoặc false
        setCheckType(e.target.checked);
    };
    const fetchData = async (params) => {
        setLoading(true);
        //kiểm tra khách hàng hay nhân viên đã có tài khoản hay chưa?
        if (
            (checkType &&
                logins.some(
                    (x) => x.staffId && x.username.toLowerCase().trim() === params.username.toLowerCase().trim(),
                )) ||
            (!checkType &&
                logins.some(
                    (x) => x.customerId && x.username.toLowerCase().trim() === params.username.toLowerCase().trim(),
                ))
        )
            notification.error({
                message: 'Lỗi',
                description: 'Đã có tài khoản này.',
                duration: 3,
            });
        else {
            const res = await loginService.insertLogin(params);
            if (res.status === 500)
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi thêm tài khoản.',
                    duration: 3,
                });
            else if (res.isSuccess) {
                history(configRoutes.account);
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
    //inser tài khoản
    const onFinish = (params) => fetchData(params);
    //xử lý xem chi tiết
    const handleDetailCustomer = async () => {
        await readDetail(form, 'customerId', setLoading, 'customer', setDataModalCustomer, setOpenCustomer);
    };
    const handleDetailStaff = async () => {
        await readDetail(form, 'staffId', setLoading, 'staff', setDataModalStaff, setOpenStaff);
    };
    return (
        <>
            <Modal
                data={dataModalCustomer}
                open={openCustomer}
                setOpen={setOpenCustomer}
                title="Thông tin khách hàng"
            />
            <Modal data={dataModalStaff} open={openStaff} setOpen={setOpenStaff} title="Thông tin nhân viên" />
            <Head title={`${configTitle.add} ${configTitle.account.toLowerCase()}`} />
            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm tài khoản</TitleAddUpdate>
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
                                        labelCol={{ span: 7 }}
                                        label="Tên tài khoản"
                                        name="username"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ tên tài khoản.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                {checkType && staffs.length && (
                                    <Col span={16} offset={4}>
                                        <Form.Item
                                            labelCol={{ span: 7 }}
                                            label="Nhân viên"
                                            name="staffId"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                                {
                                                    validator: (rule, value, cb) =>
                                                        value === -1 ? cb('Vui lòng chọn nhân viên') : cb(),
                                                    message: 'Vui lòng chọn nhân viên',
                                                },
                                            ]}
                                            initialValue={-1}
                                        >
                                            <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailStaff} />}>
                                                <Select.Option value={-1}>Chọn nhân viên</Select.Option>
                                                {staffs.map((staff) => (
                                                    <Select.Option key={staff.id} value={staff.id}>
                                                        {staff.staffName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                )}
                                {!checkType && customers.length && (
                                    <Col span={16} offset={4}>
                                        <Form.Item
                                            labelCol={{ span: 7 }}
                                            label="Khách hàng"
                                            name="customerId"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng chọn khách hàng.',
                                                },
                                                {
                                                    validator: (rule, value, cb) =>
                                                        value === -1 ? cb('Vui lòng chọn khách hàng.') : cb(),
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
                                )}

                                <Col span={16} offset={4}>
                                    <Form.Item>
                                        <Checkbox checked={checkType} onChange={handleCheckType}>
                                            {checkType ? 'Nhân viên' : 'Khách hàng'}
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item>
                                        <Link to={configRoutes.account}>
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

import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, notification, Row, Select, Spin } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configStorage, configTitle } from '~/configs';
import { injectionStaff, defaultUTC } from '~/constraints';
import { useAuth } from '~/hooks';
import { injectionScheduleService, staffService } from '~/services';
import { dataModal, dateLibrary } from '~/utils';
const Update = () => {
    useAuth();
    const [form] = Form.useForm();
    const { state } = useLocation();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [staffs, setStaffs] = useState([]);
    const [dataModalNominator, setDataModalNominator] = useState({});
    const [openModalNominator, setOpenModalNominator] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultStaffs = (await staffService.getAllStaffs()).data.filter(
                (x) => x.permissionName.toLowerCase().trim() === injectionStaff.doctor,
            );
            setStaffs(resultStaffs);
            setLoading(false);
        })();
    }, []);
    const fetchData = async (params) => {
        setLoading(true);
        const res = await injectionScheduleService.updateInjectionSchedule(state.id, params);
        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi sửa lịch tiêm.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.injectionSchedule);
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
        let updateTime = new Date(params.updateTime.format());
        updateTime = new Date(updateTime.setHours(updateTime.getHours() + defaultUTC.hours)).toISOString();
        params.updateTime = updateTime;
        const staffId = JSON.parse(Cookies.get(configStorage.login)).user.staffId;
        params.updaterId = staffId;
        fetchData(params);
    };
    const handleDetailNominator = async () => {
        if (form.getFieldValue('nominatorId') !== -1) {
            const data = await dataModal.staff(form.getFieldValue('nominatorId'));
            setDataModalNominator(data);
            setOpenModalNominator(true);
        }
    };

    return (
        <>
            <Modal
                open={openModalNominator}
                setOpen={setOpenModalNominator}
                data={dataModalNominator}
                title="Thông tin bác sĩ chỉ định"
            />
            <Head title={`${configTitle.update} ${configTitle.injectionSchedule.toLowerCase()} ${state.id}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Sửa lịch tiêm {state.id}</TitleAddUpdate>
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
                                        label="Bác sĩ chỉ định"
                                        name="nominatorId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn bác sĩ chỉ định') : cb(),
                                                message: 'Vui lòng chọn bác sĩ chỉ định',
                                            },
                                        ]}
                                        initialValue={state.nominatorId}
                                    >
                                        <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailNominator} />}>
                                            <Select.Option value={-1}>Chọn bác sĩ chỉ định</Select.Option>
                                            {staffs.map((staff) => (
                                                <Select.Option key={staff.id} value={staff.id}>
                                                    {staff.staffName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        labelCol={{ span: 7 }}
                                        initialValue={
                                            state.updateTime
                                                ? moment(new Date(state.updateTime), 'dd/MM/yyyy')
                                                : moment(new Date(), 'dd/MM/yyyy')
                                        }
                                        label="Ngày cập nhật"
                                        name="updateTime"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn ngày hẹn lại.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    dateLibrary.lessThanToday(new Date(value.format()))
                                                        ? cb('Ngày hẹn không được nhỏ hơn ngày hiện tại.')
                                                        : cb(),
                                                message: 'Ngày hẹn không được nhỏ hơn ngày hiện tại.',
                                            },
                                        ]}
                                    >
                                        <DatePicker className="w-full" />
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item
                                        labelCol={{ span: 7 }}
                                        initialValue={state.note}
                                        label="Ghi chú"
                                        name="note"
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={16} offset={4}>
                                    <Form.Item>
                                        <Link to={configRoutes.injectionSchedule}>
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

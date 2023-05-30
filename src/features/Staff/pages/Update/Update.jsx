import { InboxOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, message, notification, Row, Select, Spin, Upload } from 'antd';

import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Countries from '~/components/Countries';
import Head from '~/components/Head';
import Provinces from '~/components/Provinces';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { defaultImages, defaultUTC } from '~/constraints';
import { useAuth } from '~/hooks';
import { permissionService, provincesService, staffService, uploadService } from '~/services';
import { validate } from '~/utils';
const Update = () => {
    useAuth();
    const [form] = Form.useForm();
    const { state } = useLocation();

    const history = useNavigate();
    const { Dragger } = Upload;
    const [imageStaff, setImageStaff] = useState(state.avatar?state.avatar:'');
    const [loading, setLoading] = useState(false);
    const [permissions, setPermissions] = useState([]);
    const props = {
        name: 'file',
        multiple: false,
        customRequest: async (options) => {
            const { onSuccess, onError, file, onProgress } = options;

            const formData = new FormData();
            formData.append('file', file);
            const config = {
                headers: { 'content-type': 'multipart/form-data' },
                onUploadProgress: (event) => {
                    onProgress({ percent: (event.loaded / event.total) * 100 });
                },
            };
            uploadService
                .uploadImage(formData, config)
                .then((res) => {
                    setImageStaff(res.data);
                    onSuccess('Ok');
                })
                .catch((err) => {
                    onError({ err });
                });
        },
        onChange(info) {
            const { status } = info.file;

            if (status !== 'uploading') {
            }

            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },

        onDrop(e) {},
    };
    //get permissions
    useEffect(() => {
        (async () => {
            setLoading(true);

            const result = await permissionService.getAllPermissions();
            setPermissions(result.data);
            const resultSearchProvinces = await provincesService.searchProvinces(state.province);
            state.codeProvince = resultSearchProvinces[0]?.code;
            const resultProvince = await provincesService.getProvinceByCode(state.codeProvince);
            const district = resultProvince.districts.find((x) => x.name === state.district);
            state.codeDistrict = district.code;
            state.codeVillage = district.wards.find((x) => x.name === state.village).code;
            setLoading(false);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = async (params) => {
        setLoading(true);
        const staffs = (await staffService.getAllStaffs()).data.filter(
            (x) => x.identityCard?.toLowerCase().trim() !== state.identityCard.toLowerCase().trim(),
        );
        if (staffs.find((x) => x.identityCard?.toLowerCase().trim() === params.identityCard.toLowerCase().trim()))
            notification.error({
                message: 'Cảnh báo',
                description: 'Trùng mã CMND/CCCD.',
                duration: 3,
            });
        else {
            const res = await staffService.updateStaff(state.id, params);

            if (res.status === 500)
                notification.error({
                    message: 'Lỗi',
                    description: 'Có lỗi xảy ra khi sửa nhân viên.',
                    duration: 3,
                });
            else if (res.isSuccess) {
                history(configRoutes.staff);
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
        (async () => {
            setLoading(true);
            const province = await provincesService.getProvinceByCode(params.province);
            const district = await provincesService.getDistrictByCode(params.district);
            const ward = await provincesService.getWardByCode(params.village);
            setLoading(false);
            params.province = province.name;
            params.district = district.name;
            params.village = ward.name;
            params.avatar = imageStaff.substring(
                imageStaff.toLowerCase().trim().indexOf(defaultImages.toLowerCase().trim()),
            );
            let dateOfBirth = new Date(params.dateOfBirth.format());
            dateOfBirth = new Date(dateOfBirth.setHours(dateOfBirth.getHours() + defaultUTC.hours)).toISOString();
            params.dateOfBirth = dateOfBirth;
            fetchData(params);
        })();
    };
    return (
        <>
            <Head title={`${configTitle.update} ${configTitle.staff.toLowerCase()} ${state.staffName}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Sửa nhân viên {state.staffName}</TitleAddUpdate>
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
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.staffName}
                                        label="Tên nhân viên"
                                        name="staffName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ tên nhân viên.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.sex}
                                        label="Giới tính"
                                        name="sex"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                        ]}
                                    >
                                        <Select>
                                            <Select.Option value={true}>Nam</Select.Option>
                                            <Select.Option value={false}>Nữ</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.email}
                                        label="E-mail"
                                        name="email"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ e-mail.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    validate.isEmail(value) === true
                                                        ? cb()
                                                        : cb('E-mail không đúng định dạng'),
                                                message: 'E-mail không đúng định dạng',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={moment(new Date(state.dateOfBirth), 'dd/MM/yyyy')}
                                        label="Ngày sinh"
                                        name="dateOfBirth"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập ngày sinh.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    new Date(value.format()) >= new Date()
                                                        ? cb('Ngày sinh không được lớn hơn ngày hiện tại.')
                                                        : cb(),
                                                message: 'Ngày sinh không được lớn hơn ngày hiện tại.',
                                            },
                                        ]}
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.identityCard}
                                        label="CCCD/CMND"
                                        name="identityCard"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập cccd/cmnd.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Countries edit country={state.country} />
                                <Provinces
                                    edit
                                    province={state.codeProvince}
                                    district={state.codeDistrict}
                                    ward={state.codeVillage}
                                    address={state.address}
                                    form={form}
                                />
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.phoneNumber}
                                        label="Số điện thoại"
                                        name="phoneNumber"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập số điện thoại.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    validate.isPhoneNumber(value) === true
                                                        ? cb()
                                                        : cb('Số điện thoại không đúng định dạng.'),
                                                message: 'Số điện thoại không đúng định dạng.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.permissionId}
                                        label="Chức vụ"
                                        name="permissionId"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn chức vụ.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn chức vụ') : cb(),
                                                message: 'Vui lòng chọn chức vụ',
                                            },
                                        ]}
                                    >
                                        <Select>
                                            {permissions.map((permission) => (
                                                <Select.Option key={permission.id} value={permission.id}>
                                                    {permission.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="avatar" label="Avatar">
                                        <Dragger {...props}>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">
                                                Nhấp hoặc kéo tệp vào khu vực này để tải lên
                                            </p>
                                            <p className="ant-upload-hint">
                                                Support for a single or bulk upload. Strictly prohibit from uploading
                                                company data or other band files
                                            </p>
                                        </Dragger>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label=" ">
                                        <Link to={configRoutes.staff}>
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

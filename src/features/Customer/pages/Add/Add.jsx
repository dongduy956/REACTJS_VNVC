import { InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, Row, Select, Spin, Upload, message, notification } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Countries from '~/components/Countries';
import Head from '~/components/Head';
import Modal from '~/components/Modal';
import Provinces from '~/components/Provinces';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { defaultUTC } from '~/constraints';
import { useAuth } from '~/hooks';
import {
    additionalCustomerInformationService,
    customerService,
    customerTypeService,
    provincesService,
    uploadService,
} from '~/services';
import { readDetail, validate } from '~/utils';
const Add = () => {
    useAuth();
    const [openCustomerType, setOpenCustomerType] = useState(false);
    const [dataModalCustomerType, setDataModalCustomerType] = useState({});
    const [form] = Form.useForm();
    const history = useNavigate();
    const { Dragger } = Upload;
    //thêm trẻ em hay không?
    const [isChild, setIsChild] = useState(false);
    //xử lý có thêm trẻ em hay không?
    const handleChild = () => setIsChild(!isChild);
    //ảnh đại diện
    const [imageCustomer, setImageCustomer] = useState('');
    const [loading, setLoading] = useState(false);
    //loại khách hàng
    const [customerTypes, setCustomerTypes] = useState([]);
    //cấu hình up ảnh
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
                    setImageCustomer(res.data);
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
    //lần đầu lấy dữ liệu loại khách hàng
    useEffect(() => {
        (async () => {
            setLoading(true);
            const result = await customerTypeService.getAllCustomerTypes();
            setCustomerTypes(result.data);
            setLoading(false);
        })();
    }, []);
    const fetchData = async (params) => {
        //lấy ds khách hàng
        const customers = (await customerService.getAllCustomers()).data;
        //kiểm tra trùng mã cmnd
        if (customers.find((x) => x.identityCard?.toLowerCase().trim() === params.identityCard.trim().toLowerCase()))
            notification.warning({
                message: 'Cảnh báo',
                description: 'Trùng mã CMND/CCCD.',
                duration: 3,
            });
        //kiểm tra trùng mã bảo hiểm
        else if (
            customers.find((x) => x.insuranceCode?.toLowerCase().trim() === params.insuranceCode.trim().toLowerCase())
        )
            notification.warning({
                message: 'Cảnh báo',
                description: 'Trùng mã bảo hiểm.',
                duration: 3,
            });
        else {
            let paramsChild, paramsParent;
            //là trẻ em
            if (isChild) {
                paramsChild = {
                    weightAtBirth: params.weightAtBirth,
                    heightAtBirth: params.heightAtBirth,
                    fatherFullName: params.fatherFullName,
                    motherFullName: params.motherFullName,
                    motherPhoneNumber: params.motherPhoneNumber,
                    fatherPhoneNumber: params.fatherPhoneNumber,
                };
                paramsParent = Object.keys(params).reduce((obj, item) => {
                    if (!Object.keys(paramsChild).includes(item)) return { ...obj, [item]: params[item] };
                    return obj;
                }, {});
            }
            setLoading(true);
            let resultInsertCustomer;
            //ko phải trẻ em
            if (!isChild) {
                resultInsertCustomer = await customerService.insertCustomer(params);
                if (resultInsertCustomer.status === 500)
                    notification.error({
                        message: 'Lỗi',
                        description: 'Có lỗi xảy ra khi thêm khách hàng.',
                        duration: 3,
                    });
                else if (resultInsertCustomer.isSuccess) {
                    history(configRoutes.customer);
                    notification.success({
                        message: 'Thành công',
                        description: resultInsertCustomer.messages[0],
                        duration: 3,
                    });
                } else
                    notification.error({
                        message: 'Lỗi',
                        description: resultInsertCustomer.messages[0],
                        duration: 3,
                    });
            } else {
                resultInsertCustomer = await customerService.insertCustomer(paramsParent);
                if (resultInsertCustomer.status === 500)
                    notification.error({
                        message: 'Lỗi',
                        description: 'Có lỗi xảy ra khi thêm khách hàng.',
                        duration: 3,
                    });
                else if (!resultInsertCustomer.isSuccess)
                    notification.error({
                        message: 'Lỗi',
                        description: resultInsertCustomer.messages[0],
                        duration: 3,
                    });
                paramsChild.customerId = resultInsertCustomer.data.id;
                const resultAdditionalCustomerInformation =
                    await additionalCustomerInformationService.insertAdditionalCustomerInformation(paramsChild);
                if (resultAdditionalCustomerInformation.status === 500)
                    notification.error({
                        message: 'Lỗi',
                        description: 'Có lỗi xảy ra khi thêm thông tin khách hàng.',
                        duration: 3,
                    });
                else if (resultAdditionalCustomerInformation.isSuccess) {
                    history(configRoutes.customer);
                    notification.success({
                        message: 'Thành công',
                        description: resultAdditionalCustomerInformation.messages[0],
                        duration: 3,
                    });
                } else
                    notification.error({
                        message: 'Lỗi',
                        description: resultAdditionalCustomerInformation.messages[0],
                        duration: 3,
                    });
            }
        }
        setLoading(false);
    };
    //chạy khi đã điền các input
    const onFinish = (params) => {
        (async () => {
            const province = await provincesService.getProvinceByCode(params.province);
            const district = await provincesService.getDistrictByCode(params.district);
            const ward = await provincesService.getWardByCode(params.village);
            params.province = province.name;
            params.district = district.name;
            params.village = ward.name;
            params.avatar = imageCustomer;
            let dateOfBirth = new Date(params.dateOfBirth.format());
            dateOfBirth = new Date(dateOfBirth.setHours(dateOfBirth.getHours() + defaultUTC.hours)).toISOString();
            params.dateOfBirth = dateOfBirth;
            fetchData(params);
        })();
    };
    //xem chi tiết loại khách hàng
    const handleDetailCustomerType = async () => {
        await readDetail(
            form,
            'customerTypeId',
            setLoading,
            'customerType',
            setDataModalCustomerType,
            setOpenCustomerType,
        );
    };
    return (
        <>
            <Modal
                data={dataModalCustomerType}
                open={openCustomerType}
                setOpen={setOpenCustomerType}
                title="Thông tin loại khách hàng"
            />
            <Head title={`${configTitle.add} ${configTitle.customer.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm khách hàng</TitleAddUpdate>
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
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Họ"
                                        name="firstName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ họ.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Tên"
                                        name="lastName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ tên.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={true}
                                        rules={[{ required: true }]}
                                        label="Giới tính"
                                        name="sex"
                                    >
                                        <Select>
                                            <Select.Option value={true}>Nam</Select.Option>
                                            <Select.Option value={false}>Nữ</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
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
                                                        : cb('E-mail không đúng định dạng.'),
                                                message: 'E-mail không đúng định dạng.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        label="CMND/CCCD"
                                        name="identityCard"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ cmnd/cccd.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        label="Mã bảo hiểm"
                                        name="insuranceCode"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ mã bảo hiểm.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={moment(new Date(), 'dd/MM/yyyy')}
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
                                <Countries />
                                <Provinces form={form} />
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
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
                                        label="Loại khách hàng"
                                        name="customerTypeId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng loại khách hàng') : cb(),
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
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item initialValue={''} label="Ghi chú" name="note">
                                        <Input />
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
                                {isChild && (
                                    <>
                                        <Col span={24}>
                                            <h1>Thông tin bổ sung cho trẻ em</h1>
                                        </Col>
                                        <Col span={24} sm={{ span: 12 }}>
                                            <Form.Item
                                                label="Họ tên cha"
                                                name="fatherFullName"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập họ tên cha.',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} sm={{ span: 12 }}>
                                            <Form.Item
                                                label="Số điện thoại cha"
                                                name="fatherPhoneNumber"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập số điện thoại cha',
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
                                        <Col span={24} sm={{ span: 12 }}>
                                            <Form.Item
                                                label="Họ tên mẹ"
                                                name="motherFullName"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập họ tên mẹ',
                                                    },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} sm={{ span: 12 }}>
                                            <Form.Item
                                                label="Số điện thoại mẹ"
                                                name="motherPhoneNumber"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập số điện thoại mẹ',
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
                                        <Col span={24} sm={{ span: 12 }}>
                                            <Form.Item
                                                label="Cân nặng khi sinh"
                                                name="weightAtBirth"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập cân nặng khi sinh',
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
                                        <Col span={24} sm={{ span: 12 }}>
                                            <Form.Item
                                                label="Chiều cao khi sinh"
                                                name="heightAtBirth"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng nhập chiều cao khi sinh',
                                                    },
                                                    {
                                                        validator: (rule, value, cb) =>
                                                            value <= 0 ? cb('Chiều cao phải lớn hơn 0.') : cb(),
                                                        message: 'Chiều cao phải lớn 0.',
                                                    },
                                                ]}
                                            >
                                                <Input type="number" />
                                            </Form.Item>
                                        </Col>
                                    </>
                                )}

                                <Col span={24}>
                                    <Form.Item label=" ">
                                        <Link to={configRoutes.customer}>
                                            <Button type="dashed">Trở lại</Button>
                                        </Link>
                                        <Button className="ml-2" type="primary" htmlType="submit">
                                            Thêm
                                        </Button>
                                        <Button onClick={handleChild} className="ml-2" type="primary">
                                            Trẻ em
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

import { InboxOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, notification, Row, Select, Spin, Upload } from 'antd';
import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CustomEditor from '~/components/CustomEditor';
import Head from '~/components/Head';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configTitle } from '~/configs';
import { defaultImages } from '~/constraints';
import { useAuth } from '~/hooks';
import { typeOfVaccineService, uploadService, vaccineService } from '~/services';

const Update = () => {
    useAuth();
    const refEditor = useRef(null);
    const { Dragger } = Upload;
    const history = useNavigate();
    const { state } = useLocation();
    const [loading, setLoading] = useState(false);
    const [imageVaccine, setImageVaccine] = useState(state.image?state.image:'');
    const [typeOfVaccines, setTypeOfVaccines] = useState([]);
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
                    setImageVaccine(res.data);
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
    useEffect(() => {
        (async () => {
            setLoading(true);
            const resultTypeOfVaccines = await typeOfVaccineService.getAllTypeOfVaccines();
            setTypeOfVaccines(resultTypeOfVaccines.data);

            setLoading(false);
        })();
    }, []);
    const fetchData = async (params) => {
        setLoading(true);
        const res = await vaccineService.updateVaccine(state.id, params);

        if (res.status === 500)
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi sửa vaccine.',
                duration: 3,
            });
        else if (res.isSuccess) {
            history(configRoutes.vaccine);
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
        params.image = imageVaccine.substring(
            imageVaccine.toLowerCase().trim().indexOf(defaultImages.toLowerCase().trim()),
        );
        params.content = refEditor.current.value;
        fetchData(params);
    };
    return (
        <>
            <Head title={`${configTitle.update} ${configTitle.vaccine.toLowerCase()} ${state.name}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Sửa vaccine {state.name}</TitleAddUpdate>
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
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.name}
                                        label="Tên vaccine"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ tên vaccine.',
                                            },
                                        ]}
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>

                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.diseasePrevention}
                                        label="Phòng bệnh"
                                        name="diseasePrevention"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập phòng bệnh.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.injectionSite}
                                        label="Vị trí tiêm"
                                        name="injectionSite"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập vị trí tiêm.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.sideEffects}
                                        label="Phản ứng phụ"
                                        name="sideEffects"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn phản ứng phụ.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.amount}
                                        label="Liều lượng"
                                        name="amount"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn liều lượng.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= 0 ? cb('Liều lượng phải lớn hơn 0') : cb(),
                                            },
                                        ]}
                                    >
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.storage}
                                        label="Nơi lưu trữ"
                                        name="storage"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ nơi lưu trữ.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.storageTemperatures}
                                        label="Nhiệt độ lưu trữ"
                                        name="storageTemperatures"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập đầy đủ nhiệt độ lưu trữ.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={state.typeOfVaccineId}
                                        label="Loại vaccine"
                                        name="typeOfVaccineId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn loại vaccine') : cb(),
                                            },
                                        ]}
                                    >
                                        <Select>
                                            <Select.Option value={-1}>Chọn loại vaccine</Select.Option>
                                            {typeOfVaccines.map((typeOfVaccine) => (
                                                <Select.Option key={typeOfVaccine.id} value={typeOfVaccine.id}>
                                                    {typeOfVaccine.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Nội dung" name="content">
                                        <CustomEditor initialValue={state.content} ref={refEditor} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="image" label="Ảnh đại diện">
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
                                        <Link to={configRoutes.vaccine}>
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

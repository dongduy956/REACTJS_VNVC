import { Col, Form, Input, Select } from 'antd';
import { useEffect, useState } from 'react';
import { provincesService } from '~/services';
const Provinces = ({ edit = false, province, district, ward, address, form }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const handleSetDistrictWard = () => {
        form.setFieldsValue({
            district: -1,
            village: -1,
        });
    };
    const handleSetWard = () => {
        form.setFieldsValue({
            village: -1,
        });
    };
    useEffect(() => {
        (async () => {
            const res = await provincesService.getAllProvinces();
            setProvinces(res);
        })();
    }, []);

    useEffect(() => {
        (async () => {
            if (province) {
                const resDistrict = await provincesService.getDistrictsByCode(province);
                setDistricts(resDistrict.districts);
            }
        })();
    }, [province]);
    useEffect(() => {
        (async () => {
            if (district) {
                const resWard = await provincesService.getWardsByCode(district);
                setWards(resWard.wards);
            }
        })();
    }, [district]);
    const handleProvinces = (code) => {
        (async () => {
            handleSetDistrictWard();
            setWards([]);
            const res = await provincesService.getDistrictsByCode(code);
            setDistricts(res.districts);
        })();
    };
    const handleDistricts = (code) => {
        (async () => {
            handleSetWard();
            const res = await provincesService.getWardsByCode(code);
            setWards(res.wards);
        })();
    };
    return (
        <>
            <Col span={24} md={{ span: 12 }}>
                {edit && province ? (
                    <Form.Item
                        initialValue={province}
                        label="Tỉnh/Thành phố"
                        name="province"
                        rules={[
                            {
                                validator: (rule, value, cb) => {
                                    value <= -1 ? cb('Vui lòng chọn tỉnh thành') : cb();
                                },
                            },
                        ]}
                    >
                        <Select onChange={handleProvinces}>
                            <Select.Option value={-1}>Chọn tỉnh thành</Select.Option>
                            {provinces.map((province) => (
                                <Select.Option key={province.code} value={province.code}>
                                    {province.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                ) : (
                    edit === false && (
                        <Form.Item
                            initialValue={-1}
                            label="Tỉnh/Thành phố"
                            name="province"
                            rules={[
                                {
                                    validator: (rule, value, cb) => {
                                        value <= -1 ? cb('Vui lòng chọn tỉnh thành') : cb();
                                    },
                                },
                            ]}
                        >
                            <Select onChange={handleProvinces}>
                                <Select.Option value={-1}>Chọn tỉnh thành</Select.Option>
                                {provinces.map((province) => (
                                    <Select.Option key={province.code} value={province.code}>
                                        {province.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )
                )}
            </Col>
            <Col span={24} md={{ span: 12 }}>
                {edit && district ? (
                    <Form.Item
                        label="Quận/Huyện"
                        name="district"
                        rules={[
                            {
                                validator: (rule, value, cb) => {
                                    value <= -1 ? cb('Vui lòng chọn quận huyện') : cb();
                                },
                            },
                        ]}
                        initialValue={district}
                    >
                        <Select onChange={handleDistricts}>
                            <Select.Option value={-1}>Chọn quận huyện</Select.Option>
                            {districts.map((district) => (
                                <Select.Option key={district.code} value={district.code}>
                                    {district.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                ) : (
                    edit === false && (
                        <Form.Item
                            initialValue={-1}
                            label="Quận/Huyện"
                            name="district"
                            rules={[
                                {
                                    validator: (rule, value, cb) => {
                                        value <= -1 ? cb('Vui lòng chọn quận huyện') : cb();
                                    },
                                },
                            ]}
                        >
                            <Select onChange={handleDistricts}>
                                <Select.Option value={-1}>Chọn quận huyện</Select.Option>
                                {districts.map((district) => (
                                    <Select.Option key={district.code} value={district.code}>
                                        {district.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )
                )}
            </Col>
            <Col span={24} md={{ span: 12 }}>
                {edit && ward ? (
                    <Form.Item
                        label="Xã/Phường"
                        name="village"
                        rules={[
                            {
                                validator: (rule, value, cb) => {
                                    value <= -1 ? cb('Vui lòng chọn xã phường') : cb();
                                },
                            },
                        ]}
                        initialValue={ward}
                    >
                        <Select>
                            <Select.Option value={-1}>Chọn xã phường</Select.Option>
                            {wards.map((ward) => (
                                <Select.Option key={ward.code} value={ward.code}>
                                    {ward.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                ) : (
                    edit === false && (
                        <Form.Item
                            initialValue={-1}
                            label="Xã/Phường"
                            name="village"
                            rules={[
                                {
                                    validator: (rule, value, cb) => {
                                        value <= -1 ? cb('Vui lòng chọn phường xã.') : cb();
                                    },
                                },
                            ]}
                        >
                            <Select>
                                <Select.Option value={-1}>Chọn xã phường</Select.Option>
                                {wards.map((ward) => (
                                    <Select.Option key={ward.code} value={ward.code}>
                                        {ward.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )
                )}
            </Col>
            <Col span={24} md={{ span: 12 }}>
                <Form.Item
                    initialValue={edit ? address : ''}
                    label="Số nhà"
                    name="address"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên số nhà/thôn/xóm/đường.',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
            </Col>
        </>
    );
};
export default Provinces;

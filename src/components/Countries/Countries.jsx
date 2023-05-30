import { Col, Form, Select } from 'antd';
import { useEffect, useState } from 'react';
import { countriesService } from '~/services';
const Provinces = ({ edit = false, country }) => {
    const [countries, setCountries] = useState([]);
    useEffect(() => {
        (async () => {
            const res = await countriesService.getAllCountries();
            let data = res.map((item) => {
                const name = item.name.common === 'Vietnam' ? 'Việt Nam' : item.name.common;
                return { name };
            });
            data.sort((a, b) => a.name.localeCompare(b.name));
            setCountries(data);
        })();
    }, []);
    return (
        <Col span={24} md={{ span: 12 }}>
            <Form.Item
                initialValue={edit ? country : 'chon'}
                label="Quốc gia"
                name="country"
                rules={[
                    {
                        validator: (rule, value, cb) => {
                            value === 'chon' ? cb('Vui lòng chọn quốc gia.') : cb();
                        },
                    },
                ]}
            >
                <Select>
                    <Select.Option value={'chon'}>Chọn quốc gia</Select.Option>
                    {countries.map((country) => (
                        <Select.Option key={country.name} value={country.name}>
                            {country.name}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
    );
};
export default Provinces;

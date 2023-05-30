import { Col } from 'antd';

function TitleAddUpdate({ children }) {
    return (
        <Col span={24} className="flex items-center justify-center">
            <h1 className="text-center">{children}</h1>
        </Col>
    );
}

export default TitleAddUpdate;

import { Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import Head from '~/components/Head';
import { configTitle, configRoutes } from '~/configs';

const NotFound = () => {
    return (
        <>
            <Head title={`${configTitle.notFound}`} />

            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
                extra={
                    <Button type="primary">
                        <Link to={configRoutes.dashboard}>Trở về trang chủ</Link>
                    </Button>
                }
            />
        </>
    );
};

export default NotFound;

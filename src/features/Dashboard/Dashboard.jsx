import { Col, Row } from 'antd';
import { lazy } from 'react';
import Head from '~/components/Head';
import Loadable from '~/components/Loadable';
import { configTitle } from '~/configs';
const VaccineOutOfStock = Loadable(lazy(() => import('./components/Statistics/VaccineOutOfStock')));
const ShipmentExpires = Loadable(lazy(() => import('./components/Statistics/ShipmentExpires')));
const ShipmentInventory = Loadable(lazy(() => import('./components/Statistics/ShipmentInventory')));
const TopCustomerPay = Loadable(lazy(() => import('./components/Statistics/TopCustomerPay')));
const Dashboard = () => {
    const style = {
        boxShadow: '0 12px 32px 0 rgba(0,0,0,0.12)',
        border: '1px solid rgba(63,67,80,0.08)',
    };

    const className = 'rounded-lg p-10 bg-white';
    return (
        <>
            <Head title={configTitle.dashboard} />
            <Row gutter={[16, 16]} className="mt-4 mb-4">
                <Col span={24}>
                    <h2 className="uppercase m-2 p-0 text-center">Chào mừng bạn đến trang quản lý vnvc</h2>
                </Col>
                <Col sm={{ span: 12 }} span={24}>
                    <div style={style} className={className}>
                        <VaccineOutOfStock />
                    </div>
                </Col>
                <Col sm={{ span: 12 }} span={24}>
                    <div style={style} className={className}>
                        <ShipmentExpires />
                    </div>
                </Col>
                <Col sm={{ span: 12 }} span={24}>
                    <div style={style} className={className}>
                        <ShipmentInventory />
                    </div>
                </Col>
                <Col sm={{ span: 12 }} span={24}>
                    <div style={style} className={className}>
                        <TopCustomerPay />
                    </div>
                </Col>
            </Row>
        </>
    );
};
export default Dashboard;

import { AndroidOutlined, AppleOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import { lazy } from 'react';
import Head from '~/components/Head';
import Loadable from '~/components/Loadable';
import { configTitle } from '~/configs';
import { useAuth } from '~/hooks';
const Revenue = Loadable(lazy(() => import('./components/Revenue')));
const OrderEntrySlip = Loadable(lazy(() => import('./components/OrderEntrySlip')));
const InjectionIncident = Loadable(lazy(() => import('./components/InjectionIncident')));
const tabs = [
    {
        icon: <AppleOutlined />,
        name: 'Doanh thu',
        children: <Revenue />,
    },
    {
        icon: <AndroidOutlined />,
        name: 'Đặt hàng',
        children: <OrderEntrySlip />,
    },
    {
        icon: <AndroidOutlined />,
        name: 'Sự cố tiêm',
        children: <InjectionIncident />,
    },
];
const App = () => {
    useAuth();
    return (
        <>
            <Head title={`${configTitle.statistical}`} />

            <Tabs
                className="bg-white mt-4 mb-4 pl-2 pr-2"
                defaultActiveKey="2"
                items={tabs.map(({ name, icon, children }, index) => {
                    return {
                        label: (
                            <span>
                                {icon}
                                {name}
                            </span>
                        ),
                        key: index,
                        children,
                    };
                })}
            />
        </>
    );
};

export default App;

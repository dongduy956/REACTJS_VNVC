import { Layout } from 'antd';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Loadable from '~/components/Loadable';

import { Header, Sidebar } from './components';
import './MainLayout.css';

const { Content } = Layout;

const MainLayout = () => {
    const [breakpoint, setBreakpoint] = useState(true);
    const handleChangeBreakpoint = (broken) => setBreakpoint(broken);

    return (
        <>
            <Loadable />
            <Layout
                style={{
                    minHeight: '100vh',
                }}
            >
                <Sidebar onChangeBreakpoint={handleChangeBreakpoint} />
                <Layout className="site-layout">
                    <Header />
                    <Content
                        style={{
                            margin: '0 16px',
                        }}
                    >
                        <Outlet />
                    </Content>
                    {/* <Footer /> */}
                </Layout>
            </Layout>
        </>
    );
};
PropTypes.propTypes = {
    children: PropTypes.node.isRequired,
};
export default MainLayout;

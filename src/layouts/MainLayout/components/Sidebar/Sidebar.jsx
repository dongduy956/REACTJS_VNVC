import {
    AlertOutlined,
    BankOutlined,
    BookOutlined,
    CalendarOutlined,
    CloudDownloadOutlined,
    CloudServerOutlined,
    ClusterOutlined,
    ContactsOutlined,
    DatabaseOutlined,
    DollarCircleOutlined,
    ExperimentOutlined,
    HeartOutlined,
    IdcardOutlined,
    LoginOutlined,
    MedicineBoxOutlined,
    PieChartOutlined,
    ProfileOutlined,
    PropertySafetyOutlined,
    QrcodeOutlined,
    ReconciliationOutlined,
    RedEnvelopeOutlined,
    ScheduleOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    StarOutlined,
    TeamOutlined,
    UserSwitchOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import images from '~/components/Images';
import { configRoutes, configStorage } from '~/configs';
import { defaultPermissions, namePages } from '~/constraints';
import { roles } from '~/utils';
import './Sidebar.css';
import Cookies from 'js-cookie';
const { Sider } = Layout;

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const SiderCB = ({ onChangeBreakpoint }) => {
    const { isRoute } = roles;
    const user = Cookies.get(configStorage.login) ? JSON.parse(Cookies.get(configStorage.login)) : {};
    const listPages = [
        {
            path: configRoutes.dashboard,
            text: 'Dashboard',
            icon: <PieChartOutlined />,
            admin: true,
        },
        {
            page: namePages.PermissionDetails.name,
            path: configRoutes.permissionDetail,
            text: 'Phân quyền',
            icon: <PieChartOutlined />,
        },
        {
            page: namePages.Statistical.name,
            path: configRoutes.statistical,
            text: 'Thống kê',
            icon: <ContactsOutlined />,
            admin: Object.values(defaultPermissions).some(x=>x.toLowerCase().trim()===user?.permissionName.toLowerCase().trim()) 
        },
        {
            text: 'Quản lý',
            icon: <CloudServerOutlined />,
            children: [
                {
                    text: 'Nhà cung cấp',
                    path: configRoutes.supplier,
                    page: namePages.Supplier.name,
                    icon: <ShopOutlined />,
                },
                {
                    text: 'Loại vaccine',
                    path: configRoutes.typeOfVaccine,
                    page: namePages.TypeOfVaccine.name,
                    icon: <QrcodeOutlined />,
                },
                { text: 'Vaccine', path: configRoutes.vaccine, page: namePages.Vaccine.name, icon: <HeartOutlined /> },
                {
                    text: 'Lô vaccine',
                    path: configRoutes.shipment,
                    page: namePages.Shipment.name,
                    icon: <DatabaseOutlined />,
                },
                {
                    text: 'Giá vaccine',
                    path: configRoutes.vaccinePrice,
                    page: namePages.VaccinePrice.name,
                    icon: <DollarCircleOutlined />,
                },
                {
                    text: 'Gói vaccine',
                    path: configRoutes.vaccinePackage,
                    page: namePages.VaccinePackage.name,
                    icon: <BookOutlined />,
                },
                {
                    text: 'Loại khách hàng',
                    path: configRoutes.customerType,
                    page: namePages.CustomerType.name,
                    icon: <ContactsOutlined />,
                },
                {
                    text: 'Khách hàng',
                    path: configRoutes.customer,
                    page: namePages.Customer.name,
                    icon: <TeamOutlined />,
                },
                {
                    text: 'Quy định khách hàng',
                    icon: <ProfileOutlined />,
                    path: configRoutes.regulationCustomer,
                    page: namePages.RegulationCustomer.name,
                },
                {
                    text: 'Khám sàn lọc',
                    icon: <MedicineBoxOutlined />,
                    path: configRoutes.screeningExamination,
                    page: namePages.ScreeningExamination.name,
                },
                {
                    text: 'Xếp loại khách hàng',
                    icon: <StarOutlined />,
                    path: configRoutes.customerRank,
                    page: namePages.CustomerRank.name,
                },
                {
                    text: 'Chi tiết xếp loại khách hàng',
                    icon: <StarOutlined />,
                    path: configRoutes.customerRankDetail,
                    page: namePages.CustomerRankDetail.name,
                },
                {
                    text: 'Chức vụ',
                    icon: <ClusterOutlined />,
                    path: configRoutes.permission,
                    page: namePages.Permission.name,
                },
                {
                    text: 'Nhân viên',
                    icon: <IdcardOutlined />,
                    path: configRoutes.staff,
                    page: namePages.Staff.name,
                },
                {
                    text: 'Khuyến mãi',
                    icon: <RedEnvelopeOutlined />,
                    path: configRoutes.promotion,
                    page: namePages.Promotion.name,
                },
                {
                    text: 'Điều kiện khuyến mãi',
                    icon: <PropertySafetyOutlined />,
                    path: configRoutes.conditionPromotion,
                    page: namePages.ConditionPromotion.name,
                },
                {
                    text: 'Phương thức thanh toán',
                    icon: <BankOutlined />,
                    path: configRoutes.paymentMethod,
                    page: namePages.PaymentMethod.name,
                },
                {
                    text: 'Thanh toán',
                    icon: <ShoppingCartOutlined />,
                    path: configRoutes.pay,
                    page: namePages.Pay.name,
                },
                {
                    text: 'Tài khoản',
                    icon: <UserSwitchOutlined />,
                    path: configRoutes.account,
                    page: namePages.Login.name,
                },
                {
                    text: 'Phiên đăng nhập',
                    icon: <LoginOutlined />,
                    path: configRoutes.loginSession,
                    page: namePages.LoginSession.name,
                },
            ],
        },
        {
            text: 'Kho hàng',
            icon: <CloudDownloadOutlined />,
            children: [
                {
                    page: namePages.Order.name,
                    path: configRoutes.order,
                    text: 'Đặt hàng',
                    icon: <ProfileOutlined />,
                },
                {
                    page: namePages.EntrySlip.name,
                    path: configRoutes.entrySlip,
                    text: 'Nhập hàng',
                    icon: <ScheduleOutlined />,
                },
            ],
        },
        {
            text: 'Tiêm chủng',
            icon: <ExperimentOutlined />,
            children: [
                {
                    page: namePages.InjectionSchedule.name,
                    path: configRoutes.injectionSchedule,
                    text: 'Lịch tiêm',
                    icon: <CalendarOutlined />,
                },
                {
                    page: namePages.InjectionIncident.name,
                    path: configRoutes.injectionIncident,
                    text: 'Sự cố tiêm',
                    icon: <AlertOutlined />,
                },
                {
                    page: namePages.RegulationInjection.name,
                    path: configRoutes.regulationInjection,
                    text: 'Quy định tiêm',
                    icon: <ReconciliationOutlined />,
                },
            ],
        },
    ];
    const items = listPages.map(({ children, text, path, icon, page, admin }) => {
        if (children && !children.every((item) => !isRoute(item.page))) {
            return getItem(
                text,
                text,
                icon,
                children.map(
                    (item) =>
                        isRoute(item.page) && getItem(<Link to={item.path}>{item.text}</Link>, item.path, item.icon),
                ),
            );
        } else return (admin || (page && isRoute(page))) && getItem(<Link to={path}>{text}</Link>, path, icon);
    });
    const [collapsed, setCollapsed] = useState(false);
    const [collapsedWidth, setCollapsedWidth] = useState(80);
    const [key, setKey] = useState(configRoutes.dashboard);
    const [selectedKeys, setSelectedKeys] = useState([key]);
    const { pathname } = useLocation();
    useEffect(() => {
        if (pathname.length > 1) setKey('/' + pathname.split('/')[1]);
        else setKey(configRoutes.dashboard);
    }, [pathname]);
    useEffect(() => {
        setSelectedKeys([key]);
    }, [key]);

    return (
        <Sider
            collapsible
            collapsedWidth={collapsedWidth}
            collapsed={collapsed}
            breakpoint="md"
            onBreakpoint={(broken) => {
                broken ? setCollapsedWidth(0) : setCollapsedWidth(80);
                onChangeBreakpoint(!broken);
            }}
            onCollapse={(value) => setCollapsed(value)}
            defaultCollapsed
            width={'230px'}
        >
            <Link
                to={configRoutes.dashboard}
                className="logo flex justify-center"
                onClick={() => setSelectedKeys([configRoutes.dashboard])}
            >
                <img className={`h-16 my-4 ${collapsed && 'w-[80px]'}`} src={images.logo} alt="Logo" />
            </Link>
            <Menu
                theme="dark"
                defaultSelectedKeys={configRoutes.dashboard}
                mode="inline"
                items={items}
                selectedKeys={selectedKeys}
                onSelect={(item) => setSelectedKeys(item.key)}
            />
        </Sider>
    );
};

export default SiderCB;

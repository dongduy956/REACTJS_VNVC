import { lazy } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { configRoutes } from '~/configs';
import Loadable from './components/Loadable';
import { namePages } from './constraints';
import Account from './features/Account';
import Auth from './features/Auth';
import ConditionPromotion from './features/ConditionPromotion';
import Customer from './features/Customer';
import CustomerRank from './features/CustomerRank';
import CustomerRankDetail from './features/CustomerRankDetail';
import CustomerType from './features/CustomerType';
import EntrySlip from './features/EntrySlip';
import InjectionIncident from './features/InjectionIncident';
import InjectionSchedule from './features/InjectionSchedule';
import LoginSession from './features/LoginSession';
import Order from './features/Order';
import Pay from './features/Pay';
import PaymentMethod from './features/PaymentMethod';
import Permission from './features/Permission';
import RegulationsCustomer from './features/RegulationCustomer';
import RegulationInjection from './features/RegulationInjection';
import ScreeningExamination from './features/ScreeningExamination';
import Shipment from './features/Shipment';
import Staff from './features/Staff';
import Supplier from './features/Supplier';
import TypeOfVaccine from './features/TypeOfVaccine';
import Vaccine from './features/Vaccine';
import VaccinePackage from './features/VaccinePackage';
import VaccinePrice from './features/VaccinePrice';
import Promotion from './features/Promotion';
import EmptyLayout from './layouts/EmptyLayout';
import MainLayout from './layouts/MainLayout/MainLayout';
import { loginSelector } from './store';
import { roles } from './utils';
const NotFound = Loadable(lazy(() => import('./features/Notfound')));
const Dashboard = Loadable(lazy(() => import('./features/Dashboard')));
const Statistical = Loadable(lazy(() => import('./features/Statistical')));
const PermissionDetail = Loadable(lazy(() => import('./features/PermissionDetail')));
const App = () => {
    const { isRoute } = roles;
    const isLogin = useSelector(loginSelector);
    const listPages = [
        { path: configRoutes.vaccine, element: <Vaccine />, page: namePages.Vaccine.name },
        { path: configRoutes.customer, element: <Customer />, page: namePages.Customer.name },
        { path: configRoutes.customerType, element: <CustomerType />, page: namePages.CustomerType.name },
        { path: configRoutes.permission, element: <Permission />, page: namePages.Permission.name },
        { path: configRoutes.typeOfVaccine, element: <TypeOfVaccine />, page: namePages.TypeOfVaccine.name },
        { path: configRoutes.staff, element: <Staff />, page: namePages.Staff.name },
        { path: configRoutes.supplier, element: <Supplier />, page: namePages.Supplier.name },
        { path: configRoutes.shipment, element: <Shipment />, page: namePages.Shipment.name },
        { path: configRoutes.vaccinePrice, element: <VaccinePrice />, page: namePages.VaccinePrice.name },
        { path: configRoutes.vaccinePackage, element: <VaccinePackage />, page: namePages.VaccinePackage.name },
        { path: configRoutes.promotion, element: <Promotion />, page: namePages.Promotion.name },
        {
            path: configRoutes.conditionPromotion,
            element: <ConditionPromotion />,
            page: namePages.ConditionPromotion.name,
        },
        {
            path: configRoutes.regulationCustomer,
            element: <RegulationsCustomer />,
            page: namePages.RegulationCustomer.name,
        },
        {
            path: configRoutes.screeningExamination,
            element: <ScreeningExamination />,
            page: namePages.ScreeningExamination.name,
        },
        { path: configRoutes.paymentMethod, element: <PaymentMethod />, page: namePages.PaymentMethod.name },
        { path: configRoutes.customerRank, element: <CustomerRank />, page: namePages.CustomerRank.name },
        {
            path: configRoutes.regulationInjection,
            element: <RegulationInjection />,
            page: namePages.RegulationInjection.name,
        },
        {
            path: configRoutes.injectionIncident,
            element: <InjectionIncident />,
            page: namePages.InjectionIncident.name,
        },
        {
            path: configRoutes.injectionSchedule,
            element: <InjectionSchedule />,
            page: namePages.InjectionSchedule.name,
        },
        { path: configRoutes.pay, element: <Pay />, page: namePages.Pay.name },
        { path: configRoutes.loginSession, element: <LoginSession />, page: namePages.LoginSession.name },
        { path: configRoutes.account, element: <Account />, page: namePages.Login.name },
        { path: configRoutes.entrySlip, element: <EntrySlip />, page: namePages.EntrySlip.name },
        { path: configRoutes.order, element: <Order />, page: namePages.Order.name },
        {
            path: configRoutes.customerRankDetail,
            element: <CustomerRankDetail />,
            page: namePages.CustomerRankDetail.name,
        },
    ];
    const routePermissions = listPages.reduce((arr, item) => (isRoute(item.page) ? [...arr, item] : arr), []);
    return (
        <Router>
            <Routes>
                <Route element={isLogin ? <MainLayout /> : <EmptyLayout />}>
                    <Route
                        path={configRoutes.dashboard}
                        element={isLogin ? <Dashboard /> : <Navigate to={configRoutes.auth} />}
                    />
                    {isLogin && (
                        <>
                            <Route path={configRoutes.statistical} element={<Statistical />} />
                        </>
                    )}
                    {isRoute(namePages.PermissionDetails.name) && (
                        <Route path={configRoutes.permissionDetail} element={<PermissionDetail />} />
                    )}
                    <Route
                        path={`${configRoutes.auth}/*`}
                        element={!isLogin ? <Auth /> : <Navigate to={configRoutes.dashboard} />}
                    />
                </Route>
                {isLogin && (
                    <Route path={configRoutes.dashboard} element={<MainLayout />}>
                        {routePermissions.map((page) => (
                            <Route path={`${page.path}/*`} element={page.element} />
                        ))}
                    </Route>
                )}
                <Route element={<EmptyLayout />}>
                    <Route path={`${configRoutes.notFound}`} element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;

import { Route, Routes } from 'react-router-dom';
import { configRoutes } from '~/configs';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
import { roles } from '~/utils';
import { namePages } from '~/constraints';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const Add = Loadable(lazy(() => import('./pages/Add')));
const Report = Loadable(lazy(() => import('./pages/Report')));
const Order = () => {
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
            {roles.isPermissionCreate(namePages.Order.name) && (
                <Route path={configRoutes.add} element={<Add />}></Route>
            )}
            <Route path={`${configRoutes.report}/:id`} element={<Report />}></Route>
        </Routes>
    );
};

export default Order;

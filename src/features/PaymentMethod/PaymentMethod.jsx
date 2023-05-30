import { Route, Routes } from 'react-router-dom';
import { configRoutes } from '~/configs';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
import { roles } from '~/utils';
import { namePages } from '~/constraints';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const Add = Loadable(lazy(() => import('./pages/Add')));
const PaymentMethod = () => {
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
            {roles.isPermissionCreate(namePages.PaymentMethod.name) && (
                <Route path={configRoutes.add} element={<Add />}></Route>
            )}
        </Routes>
    );
};

export default PaymentMethod;

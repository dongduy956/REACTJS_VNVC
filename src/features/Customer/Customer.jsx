import { Route, Routes } from 'react-router-dom';
import { configRoutes } from '~/configs';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
import { roles } from '~/utils';
import { namePages } from '~/constraints';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const Add = Loadable(lazy(() => import('./pages/Add')));
const Update = Loadable(lazy(() => import('./pages/Update')));
const Customer = () => {
    const namePage = namePages.Customer.name;
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
            {roles.isPermissionCreate(namePage) && <Route path={configRoutes.add} element={<Add />}></Route>}
            {roles.isPermissionEdit(namePage) && (
                <Route path={`${configRoutes.update}/:id`} element={<Update />}></Route>
            )}
        </Routes>
    );
};

export default Customer;

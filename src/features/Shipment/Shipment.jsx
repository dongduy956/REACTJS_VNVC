import { Route, Routes } from 'react-router-dom';
import { configRoutes } from '~/configs';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
import { namePages } from '~/constraints';
import { roles } from '~/utils';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const Add = Loadable(lazy(() => import('./pages/Add')));
const Update = Loadable(lazy(() => import('./pages/Update')));
const Shipment = () => {
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
            {roles.isPermissionCreate(namePages.Shipment.name) && (
                <Route path={configRoutes.add} element={<Add />}></Route>
            )}
            {roles.isPermissionEdit(namePages.Shipment.name) && (
                <Route path={`${configRoutes.update}/:id`} element={<Update />}></Route>
            )}
        </Routes>
    );
};

export default Shipment;

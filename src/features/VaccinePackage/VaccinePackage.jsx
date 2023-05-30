import { Route, Routes } from 'react-router-dom';
import { configRoutes } from '~/configs';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
import { namePages } from '~/constraints';
import { roles } from '~/utils';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const Add = Loadable(lazy(() => import('./pages/Add')));
const VaccinePackage = () => {
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
            {roles.isPermissionCreate(namePages.VaccinePackage.name) && (
                <Route path={configRoutes.add} element={<Add />}></Route>
            )}
        </Routes>
    );
};

export default VaccinePackage;

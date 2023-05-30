import { Route, Routes } from 'react-router-dom';
import { configRoutes } from '~/configs';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
import { namePages } from '~/constraints';
import { roles } from '~/utils';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const Add = Loadable(lazy(() => import('./pages/Add')));
const Account = () => {
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
            {roles.isPermissionCreate(namePages.Login.name) && (
                <Route path={configRoutes.add} element={<Add />}></Route>
            )}
        </Routes>
    );
};

export default Account;

import { Route, Routes } from 'react-router-dom';
import { configRoutes } from '~/configs';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
import { roles } from '~/utils';
import { namePages } from '~/constraints';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const Add = Loadable(lazy(() => import('./pages/Add')));
const TypeOfVaccine = () => {
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
            {roles.isPermissionCreate(namePages.TypeOfVaccine.name) && (
                <Route path={configRoutes.add} element={<Add />} />
            )}
        </Routes>
    );
};

export default TypeOfVaccine;

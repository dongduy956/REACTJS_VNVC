import { Route, Routes } from 'react-router-dom';
import { configRoutes } from '~/configs';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
import { roles } from '~/utils';
import { namePages } from '~/constraints';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const Add = Loadable(lazy(() => import('./pages/Add')));
const Update = Loadable(lazy(() => import('./pages/Update')));
const Report = Loadable(lazy(() => import('./pages/Report')));
const InjectionSchedule = () => {
    const namePage = namePages.InjectionSchedule.name;
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
            {roles.isPermissionCreate(namePage) && <Route path={configRoutes.add} element={<Add />}></Route>}
            {roles.isPermissionEdit(namePage) && (
                <Route path={`${configRoutes.update}/:id`} element={<Update />}></Route>
            )}
            <Route path={`${configRoutes.report}/:id`} element={<Report />}></Route>
        </Routes>
    );
};
export default InjectionSchedule;

import { Route, Routes } from 'react-router-dom';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
import { configRoutes } from '~/configs';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const Report = Loadable(lazy(() => import('./pages/Report')));
const Pay = () => {
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
            <Route path={`${configRoutes.report}/:id`} element={<Report />}></Route>
        </Routes>
    );
};

export default Pay;

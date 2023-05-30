import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loadable from '~/components/Loadable';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const CustomerRankDetail = () => {
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
        </Routes>
    );
};

export default CustomerRankDetail;

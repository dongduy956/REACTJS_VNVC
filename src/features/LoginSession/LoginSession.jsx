import { Route, Routes } from 'react-router-dom';
import Loadable from '~/components/Loadable';
import { lazy } from 'react';
const Manager = Loadable(lazy(() => import('./pages/Manager')));
const LoginSession = () => {
    return (
        <Routes>
            <Route index element={<Manager />}></Route>
        </Routes>
    );
};

export default LoginSession;

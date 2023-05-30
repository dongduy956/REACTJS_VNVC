import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loadable from '~/components/Loadable';
const Login = Loadable(lazy(() => import('./pages/Login')));
function Office() {
    return (
        <Routes>
            <Route index element={<Login />}></Route>
        </Routes>
    );
}

export default Office;

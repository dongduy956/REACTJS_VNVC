import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { configRoutes } from '~/configs';
import { SliceAuth } from '~/store/Slice';
import { isLogin } from '~/utils';

function useAuth() {
    const history = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            if (!isLogin()) {
                history(configRoutes.auth);
                dispatch(SliceAuth.actions.setLogin(false));
            }
        };
    });
}

export default useAuth;

import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { configRoutes, configStorage } from '~/configs';
import { SliceAuth } from '~/store/Slice';

function useLogout() {
    const history = useNavigate();
    const dispatch = useDispatch();
    return () => {
        localStorage.removeItem(configStorage.permissions);
        Cookies.remove(configStorage.login);
        dispatch(SliceAuth.actions.setLogin(false));
        history(configRoutes.auth);
    };
}

export default useLogout;

import Cookies from 'js-cookie';
import { configStorage } from '~/configs';

const isLogin = () => !!Cookies.get(configStorage.login);
export default isLogin;

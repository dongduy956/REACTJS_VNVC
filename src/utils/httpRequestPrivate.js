import axios from 'axios';
import Cookies from 'js-cookie';
import { configStorage } from '~/configs';
import { authService } from '~/services';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.interceptors.request.use(
    async (config) => {
        const session = Cookies.get(configStorage.login) ? JSON.parse(Cookies.get(configStorage.login)) : {};

        if (session?.accessToken) {
            config.headers = {
                ...config.headers,
                authorization: `${session.accessToken_Type} ${session?.accessToken}`,
            };
        }

        return config;
    },
    (error) => Promise.reject(error),
);
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error?.config;
        if (error?.response?.status === 401 && !config?.sent) {
            config.sent = true;
            const session = Cookies.get(configStorage.login) ? JSON.parse(Cookies.get(configStorage.login)) : {};
            const result = await authService.refreshToken({
                accessToken: session?.accessToken,
                refreshToken: session?.refreshToken,
            });
            if (result.isSuccess) {
                Cookies.set(configStorage.login, JSON.stringify(result.data), { expires: result.data.expiredTime });
                config.headers = {
                    ...config.headers,
                    authorization: `${result.data.accessToken_Type} ${result.data.accessToken}`,
                };
            } else if (result.statusCode === 404) Cookies.remove(configStorage.login);
            return axios(config);
        }
        return Promise.reject(error);
    },
);
export const get = async (path, options = {}) => {
    const res = await axios.get(path, options);
    return res.data;
};
export const del = async (path, options = {}) => {
    const res = await axios.delete(path, options);
    return res.data;
};
export const post = async (path, options, params = {}) => {
    const res = await axios.post(path, options, params);
    return res.data;
};
export const put = async (path, options, params = {}) => {
    const res = await axios.put(path, options, params);
    return res.data;
};

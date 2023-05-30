import { httpRequestPublic, httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const login = async (params = {}) => {
    try {
        const res = await httpRequestPublic.post(`${configUrlApi.login}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const refreshToken = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(`${configUrlApi.refreshToken}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const logout = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.logout, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

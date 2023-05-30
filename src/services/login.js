import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getLogins = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getLogins, {
            params: {
                page,
                pagesize,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getAllLogins = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllLogins);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchLogins = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchLogins, {
            params: {
                q,
                page,
                pagesize,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const deleteLogin = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteLogin}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertLogin = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertLogin, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateLoginLock = async (id) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateLoginLock}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateLoginValidate = async (id) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateLoginValidate}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const changePassword = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.changePassword}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const resetPassword = async (id) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.resetPassword}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};

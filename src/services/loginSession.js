import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getLoginSessions = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getLoginSessions, {
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
export const searchLoginSessions = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchLoginSessions, {
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
export const deleteLoginSession = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteLoginSession}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertLoginSession = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertLoginSession, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateLoginSession = async (id) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateLoginSession}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};

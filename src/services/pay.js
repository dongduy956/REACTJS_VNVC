import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getPays = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getPays, {
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
export const searchPays = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchPays, {
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
export const getPay = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getPay}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getPayByInjectionScheduleId = async (injectionScheduleId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getPayByInjectionScheduleId}/${injectionScheduleId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertPay = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertPay, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

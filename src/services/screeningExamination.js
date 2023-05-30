import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getScreeningExaminations = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getScreeningExaminations, {
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
export const searchScreeningExaminations = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchScreeningExaminations, {
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
export const deleteScreeningExamination = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteScreeningExamination}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertScreeningExamination = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertScreeningExamination, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateScreeningExamination = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateScreeningExamination}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

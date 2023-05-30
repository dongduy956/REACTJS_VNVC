import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getInjectionSchedules = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getInjectionSchedules, {
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
export const getAllInjectionSchedules = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllInjectionSchedules);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getInjectionSchedule = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getInjectionSchedule}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};

export const searchInjectionSchedules = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchInjectionSchedules, {
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
export const deleteInjectionSchedule = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteInjectionSchedule}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertInjectionSchedule = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertInjectionSchedule, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateInjectionSchedule = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateInjectionSchedule}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

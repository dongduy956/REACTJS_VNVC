import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getInjectionIncidents = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getInjectionIncidents, {
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

export const searchInjectionIncidents = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchInjectionIncidents, {
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

export const insertInjectionIncident = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertInjectionIncident, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

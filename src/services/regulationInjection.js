import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getRegulationInjections = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getRegulationInjections, {
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
export const getAllRegulationInjections = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllRegulationInjections);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getRegulationInjectionByVaccineId = async (vaccineId) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getRegulationInjectionByVaccineId, {
            params: {
                vaccineId,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchRegulationInjections = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchRegulationInjections, {
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
export const deleteRegulationInjection = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteRegulationInjection}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertRegulationInjection = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertRegulationInjection, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertRegulationInjectionsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertRegulationInjectionsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateRegulationInjection = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateRegulationInjection}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

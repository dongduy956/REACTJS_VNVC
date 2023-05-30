import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getTypeOfVaccines = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getTypeOfVaccines, {
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
export const getAllTypeOfVaccines = async () => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getAllTypeOfVaccines}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getTypeOfVaccine = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getTypeOfVaccine}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchTypeOfVaccines = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchTypeOfVaccines, {
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
export const deleteTypeOfVaccine = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteTypeOfVaccine}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertTypeOfVaccine = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertTypeOfVaccine, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertTypeOfVaccinesRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertTypeOfVaccinesRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateTypeOfVaccine = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateTypeOfVaccine}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

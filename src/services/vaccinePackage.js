import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getVaccinePackages = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getVaccinePackages, {
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
export const getVaccinePackage = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getVaccinePackage}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getAllVaccinePackages = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllVaccinePackages);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchVaccinePackages = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchVaccinePackages, {
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
export const deleteVaccinePackage = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteVaccinePackage}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertVaccinePackage = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertVaccinePackage, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertVaccinePackagesRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertVaccinePackagesRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateVaccinePackage = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateVaccinePackage}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

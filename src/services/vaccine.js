import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getVaccines = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getVaccines, {
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
export const getVaccine = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getVaccine}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getVaccineByShipmentId = async (shipmentId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getVaccineByShipmentId}/${shipmentId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getAllVaccines = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllVaccines);
        return res;
    } catch ({ response }) {
        return response;
    }
};

export const searchVaccines = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchVaccines, {
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
export const deleteVaccine = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteVaccine}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertVaccine = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertVaccine, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertVaccinesRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertVaccinesRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateVaccine = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateVaccine}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

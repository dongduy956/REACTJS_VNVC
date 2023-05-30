import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getShipments = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getShipments, {
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
export const getShipment = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getShipment}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getShipmentsByIds = async (ids) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.getShipmentsByIds, [...ids]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getAllShipments = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllShipments);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getShipmentsBySupplierId = async (supplierId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getShipmentsBySupplierId}/${supplierId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getShipmentsByVaccineId = async (vaccineId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getShipmentsByVaccineId}/${vaccineId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchShipments = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchShipments, {
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
export const deleteShipment = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteShipment}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertShipment = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertShipment, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertShipmentsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertShipmentsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateShipment = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateShipment}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

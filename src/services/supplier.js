import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getSuppliers = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getSuppliers, {
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
export const getAllSuppliers = async () => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getAllSuppliers}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getSupplier = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getSupplier}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchSuppliers = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchSuppliers, {
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
export const deleteSupplier = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteSupplier}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertSupplier = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertSupplier, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertSuppliersRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertSuppliersRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateSupplier = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateSupplier}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

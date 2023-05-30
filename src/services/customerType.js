import { httpRequestPrivate } from '~/utils';

import { configUrlApi } from '~/configs';
export const getCustomerTypes = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getCustomerTypes, {
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
export const getCustomerType = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getCustomerType}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getAllCustomerTypes = async () => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getAllCustomerTypes}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchCustomerTypes = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchCustomerTypes, {
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
export const deleteCustomerType = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteCustomerType}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertCustomerType = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertCustomerType, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertCustomerTypesRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertCustomerTypesRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateCustomerType = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateCustomerType}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

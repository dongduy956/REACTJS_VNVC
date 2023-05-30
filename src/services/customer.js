import { httpRequestPrivate } from '~/utils';

import { configUrlApi } from '~/configs';
export const getCustomers = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getCustomers, {
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
export const getCustomersEligible = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getCustomersEligible);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getAllCustomers = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllCustomers);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getCustomer = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getCustomer}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const GetCustomerByIds = async (ids, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.GetCustomerByIds, [...ids], {
            params: { page, pagesize },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchCustomers = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchCustomers, {
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
export const deleteCustomer = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteCustomer}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertCustomer = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertCustomer, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertCustomersRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertCustomersRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateCustomer = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateCustomer}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

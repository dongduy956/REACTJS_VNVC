import { httpRequestPrivate } from '~/utils';

import { configUrlApi } from '~/configs';
export const getCustomerRanks = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getCustomerRanks, {
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
export const getAllCustomerRanks = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllCustomerRanks);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getCustomerRank = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getCustomerRank}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getCustomerRankByCustomerId = async (customerId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getCustomerRankByCustomerId}/${customerId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchCustomerRanks = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchCustomerRanks, {
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
export const deleteCustomerRank = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteCustomerRank}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertCustomerRank = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertCustomerRank, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertCustomerRanksRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertCustomerRanksRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateCustomerRank = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateCustomerRank}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getEntrySlips = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getEntrySlips, {
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
export const getEntrySlipsByOrderId = async (orderId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getEntrySlipsByOrderId}/${orderId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};

export const searchEntrySlips = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchEntrySlips, {
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
export const deleteEntrySlip = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteEntrySlip}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertEntrySlip = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertEntrySlip, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

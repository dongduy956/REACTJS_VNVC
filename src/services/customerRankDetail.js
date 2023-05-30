import { httpRequestPrivate } from '~/utils';

import { configUrlApi } from '~/configs';
export const getCustomerRankDetails = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getCustomerRankDetails, {
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
export const getCustomerRankDetailByPayId = async (payId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getCustomerRankDetailByPayId}/${payId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchCustomerRankDetails = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchCustomerRankDetails, {
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

export const insertCustomerRankDetail = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertCustomerRankDetail, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateCustomerRankDetail = async (id, point) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateCustomerRankDetail}/${id}`, null, {
            params: { point },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

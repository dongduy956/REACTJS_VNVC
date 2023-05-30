import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getPromotions = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getPromotions, {
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
export const getPromotion = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getPromotion}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getAllPromotions = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllPromotions);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchPromotions = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchPromotions, {
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
export const deletePromotion = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deletePromotion}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertPromotion = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertPromotion, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updatePromotion = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updatePromotion}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateCountPromotionsRange = async (ids) => {
    try {
        const res = await httpRequestPrivate.put(configUrlApi.updateCountPromotionsRange, [...ids]);
        return res;
    } catch ({ response }) {
        return response;
    }
};

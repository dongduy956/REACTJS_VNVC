import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getConditionPromotions = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getConditionPromotions, {
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
export const getConditionPromotionByVaccineId = async (vaccineId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getConditionPromotionByVaccineId}/${vaccineId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getConditionPromotionByPaymentMethodId = async (paymentMethodId) => {
    try {
        const res = await httpRequestPrivate.get(
            `${configUrlApi.getConditionPromotionByPaymentMethodId}/${paymentMethodId}`,
        );
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getConditionPromotionByCustomerRankId = async (customerRankId) => {
    try {
        const res = await httpRequestPrivate.get(
            `${configUrlApi.getConditionPromotionByCustomerRankId}/${customerRankId}`,
        );
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getConditionPromotionByVaccinePackageId = async (vaccinePackageId) => {
    try {
        const res = await httpRequestPrivate.get(
            `${configUrlApi.getConditionPromotionByVaccinePackageId}/${vaccinePackageId}`,
        );
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchConditionPromotions = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchConditionPromotions, {
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
export const deleteConditionPromotion = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteConditionPromotion}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertConditionPromotion = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertConditionPromotion, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateConditionPromotion = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateConditionPromotion}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

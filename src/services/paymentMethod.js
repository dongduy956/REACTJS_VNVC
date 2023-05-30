import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getPaymentMethods = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getPaymentMethods, {
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
export const getAllPaymentMethods = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllPaymentMethods);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchPaymentMethods = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchPaymentMethods, {
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
export const deletePaymentMethod = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deletePaymentMethod}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertPaymentMethod = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertPaymentMethod, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertPaymentMethodsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertPaymentMethodsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updatePaymentMethod = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updatePaymentMethod}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

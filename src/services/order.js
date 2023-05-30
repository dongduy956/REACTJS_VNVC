import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getOrders = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getOrders, {
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
export const getAllOrders = async (checkStatus = true) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllOrders, {
            params: {
                checkStatus,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getOrder = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getOrder}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};

export const searchOrders = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchOrders, {
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
export const deleteOrder = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteOrder}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertOrder = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertOrder, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateOrderStatus = async (id) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateOrderStatus}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};

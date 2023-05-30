import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getOrderDetailsByOrderId = async (orderId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getOrderDetailsByOrderId}/${orderId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getOrderDetailsByOrderIdVaccineIdShipmentId = async (orderId, vaccineId, shipmentId) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getOrderDetailsByOrderIdVaccineIdShipmentId, {
            params: {
                orderId,
                vaccineId,
                shipmentId,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const deleteOrderDetail = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteOrderDetail}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const deleteOrderDetailsByOrderId = async (orderId) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteOrderDetailsByOrderId}/${orderId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};

export const insertOrderDetail = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertOrderDetail, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertOrderDetailsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertOrderDetailsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateOrderDetail = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateOrderDetail}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

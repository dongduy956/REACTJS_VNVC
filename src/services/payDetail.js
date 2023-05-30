import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getPayDetails = async (payId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getPayDetails}/${payId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertPayDetailsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertPayDetailsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertPayDetail = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertPayDetail, { ...params });
        return res;
    } catch ({ response }) {
        return response;
    }
};

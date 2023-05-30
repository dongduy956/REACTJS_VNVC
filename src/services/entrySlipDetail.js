import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getEntrySlipDetailsByEntrySlipId = async (entrySlipId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getEntrySlipDetailsByEntrySlipId}/${entrySlipId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getEntrySlipDetailsByEntrySlipIds = async (entrySlipIds) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.getEntrySlipDetailsByEntrySlipIds, [...entrySlipIds]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const deleteEntrySlipDetail = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteEntrySlipDetail}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const deleteEntrySlipDetailsByEntrySlipId = async (entrySlipId) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteEntrySlipDetailsByEntrySlipId}/${entrySlipId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertEntrySlipDetail = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertEntrySlipDetail, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertEntrySlipDetailsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertEntrySlipDetailsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateEntrySlipDetail = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateEntrySlipDetail}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

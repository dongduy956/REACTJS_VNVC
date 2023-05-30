import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getStaffs = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getStaffs, {
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
export const getAllStaffs = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllStaffs);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getStaff = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getStaff}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchStaffs = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchStaffs, {
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
export const deleteStaff = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteStaff}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertStaff = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertStaff, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertStaffsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertStaffsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateStaff = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateStaff}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

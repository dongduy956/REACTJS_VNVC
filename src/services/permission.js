import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getPermissions = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getPermissions, {
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
export const getAllPermissions = async () => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getAllPermissions}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchPermissions = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchPermissions, {
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
export const deletePermission = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deletePermission}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertPermission = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertPermission, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertPermissionsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertPermissionsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updatePermission = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updatePermission}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

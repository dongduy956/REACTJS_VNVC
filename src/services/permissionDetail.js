import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getControllerNamesPaging = async (permissionId, page, pageSize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getControllerNamesPaging, {
            params: {
                permissionId,
                page,
                pageSize,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getControllerNames = async (permissionId) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getControllerNames, {
            params: {
                permissionId,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getPermissionDetails = async (id) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getPermissionDetails}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getPermissionDetailsByNameAndPermissionId = async (permissionValue, permissionId) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getPermissionDetailsByNameAndPermissionId, {
            params: {
                permissionValue,
                permissionId,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchControllerNames = async (permissionId, q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchControllerNames, {
            params: {
                permissionId,
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
export const deletePermissionDetails = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deletePermissionDetails}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertPermissionDetails = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertPermissionDetails, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getAdditionalCustomerInformations = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAdditionalCustomerInformations, {
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
export const getAllAdditionalCustomerInformations = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllAdditionalCustomerInformations);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getAdditionalCustomerInformationByIds = async (ids, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.getAdditionalCustomerInformationByIds, [...ids], {
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
export const searchAdditionalCustomerInformations = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchAdditionalCustomerInformations, {
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
export const deleteAdditionalCustomerInformation = async (customerId) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteAdditionalCustomerInformation}/${customerId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertAdditionalCustomerInformation = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertAdditionalCustomerInformation, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertAdditionalCustomerInformationsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertAdditionalCustomerInformationsRange, params);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateAdditionalCustomerInformation = async (customerId, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateAdditionalCustomerInformation}/${customerId}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

export const updateAdditionalCustomerInformationsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.put(configUrlApi.updateAdditionalCustomerInformationsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};

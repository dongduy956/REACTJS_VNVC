import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getRegulationCustomers = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getRegulationCustomers, {
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
export const getAllRegulationCustomers = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllRegulationCustomers);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getRegulationCustomerByCustomerTypeIdAndVaccineId = async (customerTypeId, vaccineId) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getRegulationCustomerByCustomerTypeIdAndVaccineId, {
            params: {
                customerTypeId,
                vaccineId,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchRegulationCustomers = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchRegulationCustomers, {
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
export const deleteRegulationCustomer = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteRegulationCustomer}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertRegulationCustomer = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertRegulationCustomer, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertRegulationCustomersRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertRegulationCustomersRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateRegulationCustomer = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateRegulationCustomer}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

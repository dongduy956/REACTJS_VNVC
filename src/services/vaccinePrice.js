import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getVaccinePrices = async (page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getVaccinePrices, {
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
export const getVaccinePriceLastByVaccineIdAndShipmentId = async (vaccineId, shipmentId) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getVaccinePriceLastByVaccineIdAndShipmentId, {
            params: {
                vaccineId,
                shipmentId,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchVaccinePrices = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchVaccinePrices, {
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
export const deleteVaccinePrice = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteVaccinePrice}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertVaccinePrice = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertVaccinePrice, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertVaccinePricesRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertVaccinePricesRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateVaccinePrice = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateVaccinePrice}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

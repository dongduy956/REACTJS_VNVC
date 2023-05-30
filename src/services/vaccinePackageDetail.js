import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getVaccinePackageDetailsByVaccinePackageId = async (vaccinePackageId) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getVaccinePackageDetailsByVaccinePackageId, {
            params: {
                vaccinePackageId,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getAllVaccinePackageDetails = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getAllVaccinePackageDetails);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getVaccinePackageDetail = async (vaccinePackageId, shipmentId) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getVaccinePackageDetail, {
            params: {
                vaccinePackageId,
                shipmentId,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const searchVaccinePackageDetails = async (q, page, pagesize) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.searchVaccinePackageDetails, {
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
export const deleteVaccinePackageDetail = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteVaccinePackageDetail}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const deleteVaccinePackageDetailByVaccinePackageId = async (vaccinePackageId) => {
    try {
        const res = await httpRequestPrivate.del(
            `${configUrlApi.deleteVaccinePackageDetailByVaccinePackageId}/${vaccinePackageId}`,
        );
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertVaccinePackageDetail = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertVaccinePackageDetail, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertVaccinePackageDetailsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertVaccinePackageDetailsRange, params);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateVaccinePackageDetail = async (id, params = {}) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateVaccinePackageDetail}/${id}`, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

export const updateVaccinePackageDetailsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.put(configUrlApi.updateVaccinePackageDetailsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};

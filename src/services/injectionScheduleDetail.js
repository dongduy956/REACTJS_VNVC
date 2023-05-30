import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getInjectionScheduleDetails = async (injectionScheduleId) => {
    try {
        const res = await httpRequestPrivate.get(`${configUrlApi.getInjectionScheduleDetails}/${injectionScheduleId}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const deleteInjectionScheduleDetail = async (id) => {
    try {
        const res = await httpRequestPrivate.del(`${configUrlApi.deleteInjectionScheduleDetail}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const deleteInjectionScheduleDetailsByInjectionScheduleId = async (injectionScheduleId) => {
    try {
        const res = await httpRequestPrivate.del(
            `${configUrlApi.deleteInjectionScheduleDetailsByInjectionScheduleId}/${injectionScheduleId}`,
        );
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertInjectionScheduleDetail = async (params = {}) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertInjectionScheduleDetail, {
            ...params,
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const insertInjectionScheduleDetailsRange = async (params = []) => {
    try {
        const res = await httpRequestPrivate.post(configUrlApi.insertInjectionScheduleDetailsRange, [...params]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateInjectionInjectionScheduleDetail = async (id) => {
    try {
        const res = await httpRequestPrivate.put(`${configUrlApi.updateInjectionInjectionScheduleDetail}/${id}`);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updatePayInjectionScheduleDetails = async (ids) => {
    try {
        const res = await httpRequestPrivate.put(configUrlApi.updatePayInjectionScheduleDetails, [...ids]);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const updateAddressInjectionStaffInjectionScheduleDetail = async (id, address, injectionStaffId) => {
    try {
        const res = await httpRequestPrivate.put(
            `${configUrlApi.updateAddressInjectionStaffInjectionScheduleDetail}/${id}`,
            null,
            {
                params: { address, injectionStaffId },
            },
        );
        return res;
    } catch ({ response }) {
        return response;
    }
};

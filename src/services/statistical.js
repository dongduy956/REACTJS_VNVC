import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';
export const getVaccineOutOfStocks = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getVaccineOutOfStocks);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getShipmentExpires = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getShipmentExpires);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getShipmentInventorys = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getShipmentInventorys);
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getTopCustomerPays = async () => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getTopCustomerPays);
        return res;
    } catch ({ response }) {
        return response;
    }
};

export const getRevenueByDate = async (date) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getRevenueByDate, {
            params: {
                date,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getRevenueByYear = async (year) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getRevenueByYear, {
            params: {
                year,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getRevenuesEachMonthOfYear = async (year) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getRevenuesEachMonthOfYear, {
            params: {
                year,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getRevenuesQuarterOfYear = async (year) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getRevenuesQuarterOfYear, {
            params: {
                year,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getRevenuesOther = async (dateFrom, dateTo) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getRevenuesOther, {
            params: {
                dateFrom,
                dateTo,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getRevenueByMonth = async (month, year) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getRevenueByMonth, {
            params: {
                month,
                year,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

export const getInjectionIncidentByMonth = async (month, year) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getInjectionIncidentByMonth, {
            params: {
                month,
                year,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

export const getOrderEntrySlipByDate = async (date) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getOrderEntrySlipByDate, {
            params: {
                date,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getOrderEntrySlipByYear = async (year) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getOrderEntrySlipByYear, {
            params: {
                year,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getOrderEntrySlipsEachMonthOfYear = async (year) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getOrderEntrySlipsEachMonthOfYear, {
            params: {
                year,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getOrderEntrySlipsQuarterOfYear = async (year) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getOrderEntrySlipsQuarterOfYear, {
            params: {
                year,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getOrderEntrySlipsOther = async (dateFrom, dateTo) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getOrderEntrySlipsOther, {
            params: {
                dateFrom,
                dateTo,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getOrderEntrySlipByMonth = async (month, year) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getOrderEntrySlipByMonth, {
            params: {
                month,
                year,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};
export const getEntrySlipsOfMonthByOrder = async (month, year) => {
    try {
        const res = await httpRequestPrivate.get(configUrlApi.getEntrySlipsOfMonthByOrder, {
            params: {
                month,
                year,
            },
        });
        return res;
    } catch ({ response }) {
        return response;
    }
};

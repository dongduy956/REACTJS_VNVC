import axios from 'axios';
const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_PROVINCES_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const getAllProvinces = async () => {
    const res = await httpRequest.get('p');
    return res.data;
};
export const getDistrictsByCode = async (code) => {
    const res = await httpRequest.get(`/p/${code}?depth=2`);
    return res.data;
};

export const getWardsByCode = async (code) => {
    const res = await httpRequest.get(`/d/${code}?depth=2`);
    return res.data;
};

export const getProvinceByCode = async (code) => {
    const res = await httpRequest.get(`/p/${code}?depth=3`);
    return res.data;
};

export const getDistrictByCode = async (code) => {
    const res = await httpRequest.get(`/d/${code}`);
    return res.data;
};
export const getWardByCode = async (code) => {
    const res = await httpRequest.get(`/w/${code}`);
    return res.data;
};

export const searchProvinces = async (q) => {
    const res = await httpRequest.get(`/p/search/?q=${q}`);
    return res.data;
};

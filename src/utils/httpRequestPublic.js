import axios from 'axios';
const httpRequestPublic = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const get = async (path, options = {}) => {
    const res = await httpRequestPublic.get(path, options);
    return res.data;
};
export const del = async (path, options = {}) => {
    const res = await httpRequestPublic.delete(path, options);
    return res.data;
};
export const post = async (path, options, params = {}) => {
    const res = await httpRequestPublic.post(path, options, params);
    return res.data;
};
export const put = async (path, options, params = {}) => {
    const res = await httpRequestPublic.put(path, options, params);
    return res.data;
};

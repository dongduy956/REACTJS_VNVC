import axios from 'axios';
const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_COUNTRIES_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const getAllCountries = async () => {
    const res = await httpRequest.get('all');
    return res.data;
};

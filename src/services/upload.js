import { httpRequestPrivate } from '~/utils';
import { configUrlApi } from '~/configs';

export const uploadImage = async (formData) => {
    const res = await httpRequestPrivate.post(configUrlApi.uploadImage, formData);
    return res;
};

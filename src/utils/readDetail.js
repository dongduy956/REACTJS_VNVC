import { dataModal } from '.';

const readDetail = async (form, idProp, setLoading, name, setData, setOpen) => {
    const id = form.getFieldValue(idProp);
    if (id !== -1) {
        setLoading(true);
        const data = await dataModal[name](id);
        setData(data);
        setOpen(true);
        setLoading(false);
    }
};

export default readDetail;

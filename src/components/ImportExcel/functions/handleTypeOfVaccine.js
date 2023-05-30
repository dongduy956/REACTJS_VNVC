import { message } from 'antd';
import { typeOfVaccineService } from '~/services';

const handleTypeOfVaccine = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const typeOfVaccines = (await typeOfVaccineService.getAllTypeOfVaccines()).data;
    const newData = data.reduce(
        (arr, item) =>
            arr.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim()) ||
            typeOfVaccines.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim())
                ? arr
                : [...arr, item],
        [],
    );
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await typeOfVaccineService.insertTypeOfVaccinesRange(newData);
        if (resultInsert.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} loại vaccine do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} loại vaccine`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleTypeOfVaccine;

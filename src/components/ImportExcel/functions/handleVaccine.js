import { message } from 'antd';
import { typeOfVaccineService, vaccineService } from '~/services';

const handleVaccine = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const vaccines = (await vaccineService.getAllVaccines()).data;
    const typeOfVaccines = (await typeOfVaccineService.getAllTypeOfVaccines()).data;
    const newData = data.reduce((arr, item) => {
        const typeOfVaccine = typeOfVaccines.find(
            (x) => x.name.toLowerCase().trim() === item.typeOfVaccineName.toLowerCase().trim(),
        );
        return arr.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim()) ||
            vaccines.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim()) ||
            !typeOfVaccine
            ? arr
            : [
                  ...arr,
                  {
                      ...item,
                      image: '',
                      content: '',
                      storageTemperatures: item.storageTemperatures.toString(),
                      typeOfVaccineId: typeOfVaccine.id,
                  },
              ];
    }, []);
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await vaccineService.insertVaccinesRange(newData);
        if (resultInsert.isSuccess) {
            message.warning(
                `Đã bỏ qua ${data.length - newData.length} vaccine do dữ liệu đã tồn tại hoặc vaccine không tồn tại.`,
            );
            message.success(`Thêm thành công ${newData.length} vaccine`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleVaccine;

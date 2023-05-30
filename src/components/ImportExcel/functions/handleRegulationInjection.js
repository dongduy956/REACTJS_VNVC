import { message } from 'antd';
import { regulationInjectionService, vaccineService } from '~/services';

const handleRegulationInjection = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const regulationInjections = (await regulationInjectionService.getAllRegulationInjections()).data;
    const vaccines = (await vaccineService.getAllVaccines()).data;
    const newData = data.reduce((arr, item) => {
        const vaccine = vaccines.find((x) => x.name.toLowerCase().trim() === item.vaccineName.toLowerCase().trim());
        return arr.find((x) => x.vaccineName.toLowerCase().trim() === item.vaccineName.toLowerCase().trim()) ||
            regulationInjections.find(
                (x) => x.vaccineName.toLowerCase().trim() === item.vaccineName.toLowerCase().trim(),
            ) ||
            !vaccine
            ? arr
            : [
                  ...arr,
                  {
                      ...item,
                      vaccineId: vaccine.id,
                      repeatInjection: item.repeatInjection.toLowerCase().trim().includes('không') ? 0 : -1,
                  },
              ];
    }, []);
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await regulationInjectionService.insertRegulationInjectionsRange(newData);
        if (resultInsert.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} quy định tiêm do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} quy định tiêm`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleRegulationInjection;

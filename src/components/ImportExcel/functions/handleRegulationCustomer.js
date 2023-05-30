import { message } from 'antd';
import { customerTypeService, regulationCustomerService, vaccineService } from '~/services';

const handleRegulationCustomer = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const regulationCustomers = (await regulationCustomerService.getAllRegulationCustomers()).data;
    const vaccines = (await vaccineService.getAllVaccines()).data;
    const customerTypes = (await customerTypeService.getAllCustomerTypes()).data;
    const newData = data.reduce((arr, item) => {
        const vaccine = vaccines.find((x) => x.name.toLowerCase().trim() === item.vaccineName.toLowerCase().trim());
        const customerType = customerTypes.find(
            (x) => x.name.toLowerCase().trim() === item.customerTypeName.toLowerCase().trim(),
        );
        return arr.find(
            (x) =>
                x.vaccineName.toLowerCase().trim() === item.vaccineName.toLowerCase().trim() &&
                x.customerTypeName.toLowerCase().trim() === item.customerTypeName.toLowerCase().trim(),
        ) ||
            regulationCustomers.find(
                (x) =>
                    x.vaccineName.toLowerCase().trim() === item.vaccineName.toLowerCase().trim() ||
                    x.customerTypeName.toLowerCase().trim() === item.customerTypeName.toLowerCase().trim(),
            ) ||
            !customerType ||
            !vaccine
            ? arr
            : [...arr, { ...item, vaccineId: vaccine.id, customerTypeId: customerType.id }];
    }, []);
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await regulationCustomerService.insertRegulationCustomersRange(newData);
        if (resultInsert.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} quy định khách hàng do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} quy định khách hàng`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleRegulationCustomer;

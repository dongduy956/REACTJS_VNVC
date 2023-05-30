import { message } from 'antd';
import { customerTypeService } from '~/services';

const handleCustomerType = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const customerTypes = (await customerTypeService.getAllCustomerTypes()).data;
    const newData = data.reduce(
        (arr, item) =>
            arr.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim()) ||
            customerTypes.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim())
                ? arr
                : [...arr, item],
        [],
    );
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await customerTypeService.insertCustomerTypesRange(newData);
        if (resultInsert.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} loại khách hàng do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} loại khách hàng`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleCustomerType;

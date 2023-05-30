import { message } from 'antd';
import { supplierService } from '~/services';

const handleSupplier = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const suppliers = (await supplierService.getAllSuppliers()).data;
    const newData = data.reduce(
        (arr, item) =>
            arr.find(
                (x) =>
                    x.name.toLowerCase().trim() === item.name.toLowerCase().trim() &&
                    x.address.toLowerCase().trim() === item.address.toLowerCase().trim(),
            ) ||
            suppliers.find(
                (x) =>
                    x.name.toLowerCase().trim() === item.name.toLowerCase().trim() &&
                    x.address.toLowerCase().trim() === item.address.toLowerCase().trim(),
            )
                ? arr
                : [...arr, { ...item, taxCode: item.taxCode.toString(), phoneNumber: item.phoneNumber }],
        [],
    );
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await supplierService.insertSuppliersRange(newData);
        if (resultInsert.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} nhà cung cấp do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} nhà cung cấp`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleSupplier;

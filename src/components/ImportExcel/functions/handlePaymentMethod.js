import { message } from 'antd';
import { paymentMethodService } from '~/services';

const handlePaymentMethod = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const paymentMethods = (await paymentMethodService.getAllPaymentMethods()).data;
    const newData = data.reduce(
        (arr, item) =>
            arr.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim()) ||
            paymentMethods.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim())
                ? arr
                : [...arr, item],
        [],
    );
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await paymentMethodService.insertPaymentMethodsRange(newData);
        if (resultInsert.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} phương thức thanh toán do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} phương thức thanh toán`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handlePaymentMethod;

import { message } from 'antd';
import { permissionService } from '~/services';

const handlePermission = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const permissions = (await permissionService.getAllPermissions()).data;
    const newData = data.reduce(
        (arr, item) =>
            arr.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim()) ||
            permissions.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim())
                ? arr
                : [...arr, item],
        [],
    );
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await permissionService.insertPermissionsRange(newData);
        if (resultInsert.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} chức vụ do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} chức vụ`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handlePermission;

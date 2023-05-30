import { message } from 'antd';
import { permissionService, staffService } from '~/services';

const handleStaff = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const staffs = (await staffService.getAllStaffs()).data;
    const permissions = (await permissionService.getAllPermissions()).data;
    const newData = data.reduce((arr, item) => {
        const permission = permissions.find(
            (x) => x.name.toLowerCase().trim() === item.permissionName.trim().toLowerCase(),
        );
        const staff = staffs.find(
            (x) => x.identityCard.toLowerCase().trim() === item.identityCard.toString().toLowerCase().trim(),
        );
        return arr.find(
            (x) => x.identityCard.toLowerCase().trim() === item.identityCard.toString().toLowerCase().trim(),
        ) ||
            staff ||
            !permission
            ? arr
            : [
                  ...arr,
                  {
                      ...item,
                      sex: item.sex.toLowerCase().trim() === 'nam',
                      identityCard: item.identityCard.toString(),
                      phoneNumber: item.phoneNumber.toString(),
                      avatar: '',
                      permissionId: permission.id,
                  },
              ];
    }, []);
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await staffService.insertStaffsRange(newData);
        if (resultInsert.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} nhân viên do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} nhân viên`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleStaff;

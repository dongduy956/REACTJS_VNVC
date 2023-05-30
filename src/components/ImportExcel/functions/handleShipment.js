import { message } from 'antd';
import { shipmentService, supplierService, vaccineService } from '~/services';

const handleShipment = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const shipments = (await shipmentService.getAllShipments()).data;
    const vaccines = (await vaccineService.getAllVaccines()).data;
    const suppliers = (await supplierService.getAllSuppliers()).data;
    const newData = data.reduce((arr, item) => {
        const vaccine = vaccines.find((x) => x.name.toLowerCase().trim() === item.vaccineName.toLowerCase().trim());
        const supplier = suppliers.find((x) => x.name.toLowerCase().trim() === item.supplierName.toLowerCase().trim());

        return arr.find((x) => x.shipmentCode.toLowerCase().trim() === item.shipmentCode.toLowerCase().trim()) ||
            shipments.find((x) => x.shipmentCode.toLowerCase().trim() === item.shipmentCode.toLowerCase().trim()) ||
            !supplier ||
            !vaccine
            ? arr
            : [...arr, { ...item, vaccineId: vaccine.id, supplierId: supplier.id, country: supplier.address }];
    }, []);
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await shipmentService.insertShipmentsRange(newData);
        if (resultInsert.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} lô vaccine do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} lô vaccine`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleShipment;

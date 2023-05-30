import { message } from 'antd';
import { shipmentService, vaccinePriceService, vaccineService } from '~/services';

const handleVaccinePrice = async (data, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    const vaccines = (await vaccineService.getAllVaccines()).data;
    const shipments = (await shipmentService.getAllShipments()).data;
    const newData = data.reduce((arr, item) => {
        const vaccine = vaccines.find((x) => x.name.toLowerCase().trim() === item.vaccineName.toLowerCase().trim());
        const shipment = shipments.find(
            (x) => x.shipmentCode.toLowerCase().trim() === item.shipmentCode.toLowerCase().trim(),
        );
        return !vaccine || !shipment ? arr : [...arr, { ...item, vaccineId: vaccine.id, shipmentId: shipment.id }];
    }, []);
    if (newData.length === 0) message.warning('Dữ liệu đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsert = await vaccinePriceService.insertVaccinePricesRange(newData);
        if (resultInsert.isSuccess) {
            message.success(`Thêm thành công ${newData.length} giá vaccine.`);
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
    }
    setLoading(false);
};

export default handleVaccinePrice;

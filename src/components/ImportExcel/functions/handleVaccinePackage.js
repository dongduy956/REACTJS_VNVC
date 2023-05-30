import { message } from 'antd';
import {
    shipmentService,
    vaccinePackageService,
    vaccineService,
    regulationInjectionService,
    vaccinePackageDetailService,
} from '~/services';

const handleVaccinePackage = async (data, subData, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    let vaccinePackages = (await vaccinePackageService.getAllVaccinePackages()).data;
    const newData = data.reduce(
        (arr, item) =>
            arr.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim()) ||
            vaccinePackages.find((x) => x.name.toLowerCase().trim() === item.name.toLowerCase().trim())
                ? arr
                : [...arr, item],
        [],
    );
    if (newData.length === 0)
        message.warning('Dữ liệu gói vaccine đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsertVaccinePackage = await vaccinePackageService.insertVaccinePackagesRange(newData);
        if (resultInsertVaccinePackage.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} gói vaccine do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} gói vaccine`);
            const vaccinePackageDetails = (await vaccinePackageDetailService.getAllVaccinePackageDetails()).data;
            vaccinePackages = (await vaccinePackageService.getAllVaccinePackages()).data;
            const shipments = (await shipmentService.getAllShipments()).data;
            const vaccines = (await vaccineService.getAllVaccines()).data;
            const regulationInjections = (await regulationInjectionService.getAllRegulationInjections()).data;
            const newSubData = subData.reduce((arr, item) => {
                const vaccinePackage = vaccinePackages.find(
                    (x) => x.name.toLowerCase().trim() === item.vaccinePackageName.toLowerCase().trim(),
                );
                const shipment = shipments.find(
                    (x) => x.shipmentCode.toLowerCase().trim() === item.shipmentCode.toLowerCase().trim(),
                );
                const vaccine = vaccines.find(
                    (x) => x.name.toLowerCase().trim() === item.vaccineName.toLowerCase().trim(),
                );
                const regulationInjection = regulationInjections.find(
                    (x) => x.vaccineName.toLowerCase().trim() === item.vaccineName.toLowerCase().trim(),
                );
                return arr.find(
                    (x) =>
                        x.vaccineName.toLowerCase().trim() === item.vaccineName.toLowerCase().trim() &&
                        x.shipmentCode.toLowerCase().trim() === item.shipmentCode.toLowerCase().trim(),
                ) ||
                    !vaccinePackage ||
                    !shipment ||
                    !vaccine ||
                    !regulationInjection
                    ? arr
                    : [
                          ...arr,
                          {
                              ...item,
                              vaccineId: vaccine.id,
                              shipmentId: shipment.id,
                              vaccinePackageId: vaccinePackage.id,
                              orderInjection: regulationInjection.order,
                          },
                      ];
            }, []);
            const { dataInserts, dataUpdates } = newSubData.reduce(
                (obj, item) => {
                    const vaccinePackageDetail = vaccinePackageDetails.find(
                        (x) =>
                            x.shipmentCode.toLowerCase().trim() === item.shipmentCode.toLowerCase().trim() &&
                            x.vaccineName.toLowerCase().trim() === item.vaccineName.toLowerCase().trim(),
                    );
                    return vaccinePackageDetail
                        ? {
                              ...obj,
                              dataUpdates: [
                                  ...obj.dataUpdates,
                                  {
                                      ...item,
                                      id: vaccinePackageDetail.id,
                                      numberOfInjections:
                                          item.numberOfInjections + vaccinePackageDetail.numberOfInjections,
                                      isGeneral: !item.isGeneral.toLowerCase().trim().includes('không'),
                                  },
                              ],
                          }
                        : {
                              ...obj,
                              dataInserts: [
                                  ...obj.dataInserts,
                                  {
                                      ...item,
                                      isGeneral: !item.isGeneral.toLowerCase().trim().includes('không'),
                                  },
                              ],
                          };
                },
                { dataUpdates: [], dataInserts: [] },
            );
            let sumRecords = 0;
            if (dataInserts.length > 0) {
                const resultInsert = await vaccinePackageDetailService.insertVaccinePackageDetailsRange(dataInserts);
                if (resultInsert.isSuccess) sumRecords += dataInserts.length;
                else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
            }
            if (dataUpdates.length > 0) {
                const resultUpdate = await vaccinePackageDetailService.updateVaccinePackageDetailsRange(dataUpdates);
                if (resultUpdate.isSuccess) sumRecords += dataUpdates.length;
                else message.error(`Có lỗi xảy ra. ${resultUpdate.messages[0]}`);
            }
            if (sumRecords > 0) {
                message.warning(`Đã bỏ qua ${subData.length - sumRecords} chi tiết gói vaccine do dữ liệu đã tồn tại.`);
                message.success(`Thêm/sửa thành công ${sumRecords} chi tiết gói vaccine`);
            }
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsertVaccinePackage.messages[0]}`);
    }
    setLoading(false);
};

export default handleVaccinePackage;

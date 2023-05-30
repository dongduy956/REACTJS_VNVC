import { message } from 'antd';
import { additionalCustomerInformationService, customerService, customerTypeService } from '~/services';

const handleCustomer = async (data, subData, setOpen, setTable, setData, setLoading) => {
    setLoading(true);
    let customers = (await customerService.getAllCustomers()).data;
    const customerTypes = (await customerTypeService.getAllCustomerTypes()).data;
    const newData = data.reduce((arr, item) => {
        const customerType = customerTypes.find(
            (x) => x.name.toLowerCase().trim() === item.customerTypeName.toLowerCase().trim(),
        );
        const customer = customers.find(
            (x) => x.insuranceCode?.toLowerCase().trim() === item.insuranceCode.toString().toLowerCase().trim(),
        );
        return arr.find(
            (x) => x.insuranceCode.toLowerCase().trim() === item.insuranceCode.toString().toLowerCase().trim(),
        ) ||
            customer ||
            !customerType
            ? arr
            : [
                  ...arr,
                  {
                      ...item,
                      identityCard: item.identityCard.toString(),
                      insuranceCode: item.insuranceCode.toString(),
                      sex: item.sex.toLowerCase().trim() === 'nam',
                      phoneNumber: item.phoneNumber.toString(),
                      customerTypeId: customerType.id,
                  },
              ];
    }, []);
    if (newData.length === 0) message.warning('Dữ liệu khách hàng đã tồn tại hoặc dữ liệu rỗng vui lòng kiểm tra lại.');
    else {
        const resultInsertCustomer = await customerService.insertCustomersRange(newData);
        if (resultInsertCustomer.isSuccess) {
            message.warning(`Đã bỏ qua ${data.length - newData.length} khách hàng do dữ liệu đã tồn tại.`);
            message.success(`Thêm thành công ${newData.length} khách hàng`);
            customers = (await customerService.getAllCustomers()).data;
            const customerDetails = (await additionalCustomerInformationService.getAllAdditionalCustomerInformations())
                .data;
            const newSubData = subData.reduce((arr, item) => {
                const customer = customers.find(
                    (x) => x.insuranceCode?.toLowerCase().trim() === item.insuranceCode.toString().toLowerCase().trim(),
                );
                return arr.find(
                    (x) => x.insuranceCode.toLowerCase().trim() === item.insuranceCode.toString().toLowerCase().trim(),
                ) || !customer
                    ? arr
                    : [...arr, { ...item, insuranceCode: item.insuranceCode.toString(), customerId: customer.id }];
            }, []);
            const { dataInserts, dataUpdates } = newSubData.reduce(
                (obj, item) => {
                    const customerDetail = customerDetails.find((x) => x.customerId === item.customerId);
                    return customerDetail
                        ? {
                              ...obj,
                              dataUpdates: [
                                  ...obj.dataUpdates,
                                  {
                                      ...item,
                                      id: customerDetail.id,
                                  },
                              ],
                          }
                        : {
                              ...obj,
                              dataInserts: [...obj.dataInserts, item],
                          };
                },
                { dataUpdates: [], dataInserts: [] },
            );
            let sumRecords = 0;
            if (dataInserts.length > 0) {
                const resultInsert =
                    await additionalCustomerInformationService.insertAdditionalCustomerInformationsRange(dataInserts);
                if (resultInsert.isSuccess) sumRecords += dataInserts.length;
                else message.error(`Có lỗi xảy ra. ${resultInsert.messages[0]}`);
            }
            if (dataUpdates.length > 0) {
                const resultUpdate =
                    await additionalCustomerInformationService.updateAdditionalCustomerInformationsRange(dataUpdates);
                if (resultUpdate.isSuccess) sumRecords += dataUpdates.length;
                else message.error(`Có lỗi xảy ra. ${resultUpdate.messages[0]}`);
            }
            if (sumRecords > 0) {
                message.warning(`Đã bỏ qua ${subData.length - sumRecords} chi tiết khách hàng do dữ liệu đã tồn tại.`);
                message.success(`Thêm/sửa thành công ${sumRecords} chi tiết khách hàng`);
            }
            setOpen(false);
            setTable();
            setData([]);
        } else message.error(`Có lỗi xảy ra. ${resultInsertCustomer.messages[0]}`);
    }
    setLoading(false);
};

export default handleCustomer;

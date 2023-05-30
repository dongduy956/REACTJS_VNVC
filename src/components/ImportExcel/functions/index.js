import { typeImportExcel } from '~/constraints';
import handleCustomer from './handleCustomer';
import handleCustomerRank from './handleCustomerRank';
import handleCustomerType from './handleCustomerType';
import handlePaymentMethod from './handlePaymentMethod';
import handlePermission from './handlePermission';
import handleRegulationCustomer from './handleRegulationCustomer';
import handleRegulationInjection from './handleRegulationInjection';
import handleShipment from './handleShipment';
import handleStaff from './handleStaff';
import handleSupplier from './handleSupplier';
import handleTypeOfVaccine from './handleTypeOfVaccine';
import handleVaccine from './handleVaccine';
import handleVaccinePackage from './handleVaccinePackage';
import handleVaccinePrice from './handleVaccinePrice';

const handleImport = async (type, setOpen, setTable, setData, setLoading, data, subData) => {
    // eslint-disable-next-line default-case
    switch (type) {
        case typeImportExcel.typeOfVaccine:
            await handleTypeOfVaccine(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.vaccine:
            await handleVaccine(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.vaccinePackage:
            await handleVaccinePackage(data, subData, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.shipment:
            await handleShipment(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.vaccinePrice:
            await handleVaccinePrice(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.customerType:
            await handleCustomerType(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.customerRank:
            await handleCustomerRank(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.supplier:
            await handleSupplier(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.paymentMethod:
            await handlePaymentMethod(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.regulationCustomer:
            await handleRegulationCustomer(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.regulationInjection:
            await handleRegulationInjection(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.customer:
            await handleCustomer(data, subData, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.staff:
            await handleStaff(data, setOpen, setTable, setData, setLoading);
            break;
        case typeImportExcel.permission:
            await handlePermission(data, setOpen, setTable, setData, setLoading);
            break;
    }
};

export default handleImport;

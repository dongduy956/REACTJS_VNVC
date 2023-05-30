import {
    customerTypeService,
    staffService,
    supplierService,
    vaccinePackageService,
    vaccineService,
    customerService,
    additionalCustomerInformationService,
    shipmentService,
    orderService,
    promotionService,
    customerRankService,
} from '~/services';
import { stringLibrary } from '.';

export const customerType = async (id) => {
    const result = await customerTypeService.getCustomerType(id);
    if (result.isSuccess) {
        const data = result.data;
        return {
            'Mã loại khách hàng': data.id,
            'Tên loại khách hàng': data.name,
            'Độ tuổi': data.age,
        };
    }
    return {};
};
export const customerRank = async (id) => {
    const result = await customerRankService.getCustomerRank(id);
    if (result.isSuccess) {
        const data = result.data;
        return {
            'Mã xếp loại khách hàng': data.id,
            'Tên xếp loại khách hàng': data.name,
            'Tổng điểm': data.point,
        };
    }
    return {};
};
export const staff = async (id) => {
    const result = await staffService.getStaff(id);
    if (result.isSuccess) {
        const staff = result.data;
        return {
            'Mã nhân viên': staff.id,
            'Họ tên': staff.staffName,
            'Chức vụ': staff.permissionName,
            'Giới tính': staff.sex ? 'Nam' : 'Nữ',
            'Quốc tịch': staff.country,
            'Địa chỉ': `${staff.address}, ${staff.village}, ${staff.district}, ${staff.province}`,
            'Ngày sinh': staff.dateOfBirth,
            'E-mail': staff.email,
            'Số điện thoại': staff.phoneNumber,
            'Ảnh đại diện': staff.avatar,
        };
    }
    return {};
};
export const vaccine = async (id) => {
    const result = await vaccineService.getVaccine(id);
    if (result.isSuccess) {
        const data = result.data;
        return {
            'Mã vaccine': data.id,
            'Tên vaccine': data.name,
            'Phòng bệnh': data.diseasePrevention,
            'Vị trí tiêm': data.injectionSite,
            'Phản ứng phụ': data.sideEffects,
            'Liều lượng': data.amount + 'ml',
            'Nơi lưu trữ': data.storage,
            'Nhiệt độ lưu trữ': data.storageTemperatures + '°C',
            'Tên loại vacicne': data.typeOfVaccineName,
            'Số lượng còn': data.quantityRemain,
            'Hình ảnh': data.image,
        };
    }
    return {};
};
export const supplier = async (id) => {
    const result = await supplierService.getSupplier(id);
    if (result.isSuccess) {
        const data = result.data;
        return {
            'Mã nhà cung cấp': data.id,
            'Tên nhà cung cấp': data.name,
            'Địa chỉ': data.address,
            'Số điện thoại': data.phoneNumber,
            'Tax code': data.taxCode,
            'E-mail': data.email,
        };
    }
    return {};
};
export const vaccinePackage = async (id) => {
    const result = await vaccinePackageService.getVaccinePackage(id);
    if (result.isSuccess) {
        const data = result.data;
        return {
            'Mã gói tiêm': data.id,
            'Tên gói tiêm': data.name,
            'Đối tượng tiêm': data.objectInjection,
        };
    }
    return {};
};
export const customer = async (id) => {
    let result = await customerService.getCustomer(id);
    if (result.isSuccess) {
        let data = result.data;
        result = await additionalCustomerInformationService.deleteAdditionalCustomerInformation(id);
        const obj = {
            'Mã khách hàng': data.id,
            'Họ tên': `${data.firstName} ${data.lastName}`,
            'Loại khách hàng': data.customerTypeName,
            'Giới tính': data.sex ? 'Nam' : 'Nữ',
            'Quốc tịch': data.country,
            'Địa chỉ': `${data.address}, ${data.village}, ${data.district}, ${data.province}`,
            'Ngày sinh': data.dateOfBirth,
            'E-mail': data.email,
            'Số điện thoại': data.phoneNumber,
            'Ghi chú': data.note,
        };
        const avatar = data.avatar;
        data = result.data;
        if (result.isSuccess) {
            return {
                ...obj,
                'Họ tên cha': data.fatherFullName,
                'Họ tên mẹ': data.motherFullName,
                'Số điện thoại cha': data.fatherPhoneNumber,
                'Số điện thoại mẹ': data.motherPhoneNumber,
                'Cân nặng khi sinh': data.weightAtBirth,
                'Chiều cao khi sinh': data.heightAtBirth,
                'Ảnh đại diện': avatar,
            };
        } else return { ...obj, 'Ảnh đại diện': avatar };
    }
    return {};
};
export const shipment = async (id) => {
    const result = await shipmentService.getShipment(id);
    if (result.isSuccess) {
        const data = result.data;
        return {
            'Mã lô': data.shipmentCode,
            'Nhà cung cấp': data.supplierName,
            Vaccine: data.vaccineName,
            'Ngày sản xuất': data.manufactureDate,
            'Ngày hết hạn': data.expirationDate,
            'Quốc gia': data.country,
            'Số lượng còn': data.quantityRemain,
        };
    }
    return {};
};
export const order = async (id) => {
    const result = await orderService.getOrder(id);
    if (result.isSuccess) {
        const data = result.data;
        return {
            'Mã phiếu đặt': data.id,
            'Nhà cung cấp': data.supplierName,
            'Nhân viên': data.staffName,
            'Ngày đặt': data.created,
            'Tổng tiền': stringLibrary.formatMoney(data.total),
            'Trạng thái': data.status === 2 ? 'Đã nhập' : data.status === 0 ? 'Chưa nhập' : 'Đang nhập',
        };
    }
    return {};
};
export const promotion = async (id) => {
    const result = await promotionService.getPromotion(id);
    if (result.isSuccess) {
        const data = result.data;
        return {
            'Mã khuyến mãi': data.promotionCode,
            'Giảm giá': Number(data.discount) * 100 + '%',
            'Số lượt dùng': data.count,
            'Tổng lượt dùng': data.max,
            'Ngày bắt đầu': data.startDate,
            'Ngày kết thúc': data.endDate,
        };
    }
    return {};
};

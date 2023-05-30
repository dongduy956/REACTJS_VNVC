import { entrySlipDetailService } from '~/services';
import { stringLibrary } from '~/utils';

const entrySlip = async (state, setReport) => {
    const entrySlipDetails = (await entrySlipDetailService.getEntrySlipDetailsByEntrySlipId(state.id)).data;
    const newEntrySlipDetails = entrySlipDetails.map((item, index) => ({
        id: index + 1,
        vaccine: item.vaccineName,
        shipment: item.shipmentCode,
        number: item.number,
        price: stringLibrary.formatMoney(Number(item.price)),
        total: stringLibrary.formatMoney(Number(item.total)),
    }));
    const total = stringLibrary.formatMoney(entrySlipDetails.reduce((sum, item) => sum + item.total, 0));
    const newData = {
        name: 'Báo cáo phiếu nhập hàng',
        left: {
            labels: [
                {
                    label: 'Mã nhập',
                    minWidth: 125,
                },
                {
                    label: 'Ngày tạo',
                    minWidth: 125,
                },
                {
                    label: 'Nhập từ phiếu đặt hàng',
                    minWidth: 125,
                },
            ],
            values: [state.id, new Date(state.created).toLocaleString(), state.orderId],
        },
        right: {
            labels: [
                {
                    label: 'Nhân viên nhập',
                    minWidth: 90,
                },
                {
                    label: 'Nhà cung cấp',
                    minWidth: 90,
                },
                {
                    label: 'Ngày in',
                    minWidth: 90,
                },
            ],
            values: [state.staffName, state.supplierName, new Date().toLocaleString()],
        },
        columns: [
            {
                name: 'Stt',
                width: '4%',
            },

            {
                name: 'Vaccine',
                width: '30%',
            },
            {
                name: 'Lô vaccine',
                width: '30%',
            },
            {
                name: 'Số lượng',
                width: '12%',
            },
            {
                name: 'Đơn giá',
                width: '12%',
            },
            {
                name: 'Thành tiền',
                width: '12%',
            },
        ],
        total,
        data: newEntrySlipDetails,
    };
    setReport(newData);
};
export default entrySlip;

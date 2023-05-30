import { orderDetailService } from '~/services';
import { stringLibrary } from '~/utils';

const order = async (state, setReport) => {
    const orderDetails = (await orderDetailService.getOrderDetailsByOrderId(state.id)).data;
    const newOrderDetails = orderDetails.map((item, index) => ({
        id: index + 1,
        vaccine: item.vaccineName,
        shipment: item.shipmentCode,
        number: item.number,
        price: stringLibrary.formatMoney(Number(item.price)),
        total: stringLibrary.formatMoney(Number(item.total)),
    }));
    const total = stringLibrary.formatMoney(orderDetails.reduce((sum, item) => sum + item.total, 0));
    const newData = {
        name: 'Báo cáo đơn đặt hàng',
        left: {
            labels: [
                {
                    label: 'Mã đặt',
                    minWidth: 70,
                },
                {
                    label: 'Ngày tạo',
                    minWidth: 70,
                },
            ],
            values: [state.id, new Date(state.created).toLocaleString()],
        },
        right: {
            labels: [
                {
                    label: 'Nhân viên đặt',
                    minWidth: 80,
                },
                {
                    label: 'Nhà cung cấp',
                    minWidth: 80,
                },
                {
                    label: 'Ngày in',
                    minWidth: 80,
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
        data: newOrderDetails,
    };
    setReport(newData);
};
export default order;

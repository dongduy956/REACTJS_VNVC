import { injectionScheduleService, payDetailService } from '~/services';
import { stringLibrary } from '~/utils';

const pay = async (state, setReport) => {
    const payDetails = (await payDetailService.getPayDetails(state.id)).data;
    const injectionSchedule = (await injectionScheduleService.getInjectionSchedule(state.injectionScheduleId)).data;
    const newPayDetails = payDetails.map((item, index) => ({
        id: index + 1,
        vaccine: item.vaccineName,
        vaccinePackage: item.vaccinePackageName,
        number: item.number,
        discount: Number(item.discount) * 100 + '%',
        price: stringLibrary.formatMoney(Number(item.price)),
        total: stringLibrary.formatMoney(Number(item.total)),
    }));
    const total = stringLibrary.formatMoney(state.total);
    const discountPackages = payDetails.reduce(
        (arr, item) =>
            item.vaccinePackageId && !arr.find((x) => x.id === item.vaccinePackageId)
                ? [
                      ...arr,
                      {
                          id: item.vaccinePackageId,
                          name: `Giảm giá gói '${item.vaccinePackageName.toLowerCase()}'`,
                          discount: Number(item.discountPackage) * 100 + '%',
                      },
                  ]
                : arr,
        [],
    );
    const newData = {
        name: 'Báo cáo phiếu thu',
        left: {
            labels: [
                {
                    label: 'Mã nhập',
                    minWidth: 125,
                },
                {
                    label: 'Ngày thanh toán',
                    minWidth: 125,
                },
                {
                    label: 'Thanh toán lịch tiêm',
                    minWidth: 125,
                },
                {
                    label: 'Giảm giá',
                    minWidth: 125,
                },
            ],
            values: [
                state.id,
                new Date(state.created).toLocaleString(),
                state.injectionScheduleId,
                state.discount * 100 + '%',
            ],
        },
        right: {
            labels: [
                {
                    label: 'Khách hàng',
                    minWidth: 125,
                },
                {
                    label: 'Nhân viên thu',
                    minWidth: 125,
                },
                {
                    label: 'Phương thức thanh toán',
                    minWidth: 125,
                },
                {
                    label: 'Ngày in',
                    minWidth: 125,
                },
            ],
            values: [
                injectionSchedule.customerName,
                state.staffName,
                state.paymentMethodName,
                new Date().toLocaleString(),
            ],
        },
        columns: [
            {
                name: 'Stt',
                width: '4%',
            },

            {
                name: 'Vaccine',
                width: '25%',
            },
            {
                name: 'Gói vaccine',
                width: '25%',
            },
            {
                name: 'Số lượng',
                width: '10%',
            },
            {
                name: 'Giảm giá',
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
        data: newPayDetails,
        discountPackages,
        note: 'Giảm giá gói vaccine cơ bản lấy phần trăm theo tổng vaccine trong gói.',
    };

    setReport(newData);
};
export default pay;

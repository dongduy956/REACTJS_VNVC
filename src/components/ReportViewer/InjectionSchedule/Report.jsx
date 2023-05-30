import { Document, Font, Image, Page, StyleSheet } from '@react-pdf/renderer';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import images from '~/components/Images';
import { configStorage } from '~/configs';
import { injectionScheduleDetailService } from '~/services';
import ReportFooter from './ReportFooter';
import ReportItemsTable from './ReportItemsTable';
import ReportNo from './ReportNo';
import ReportTitle from './ReportTitle';
Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});
const styles = StyleSheet.create({
    page: {
        fontFamily: 'Roboto',
        fontSize: 11,
        lineHeight: 1.5,
        flexDirection: 'column',
        padding: 10,
    },
    logo: {
        width: 250,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
});

const Report = ({ state }) => {
    const [report, setReport] = useState();
    const staffName = JSON.parse(Cookies.get(configStorage.login)).user.staffName;

    useEffect(() => {
        (async () => {
            const injectionDetails = (
                await injectionScheduleDetailService.getInjectionScheduleDetails(state.id)
            ).data.map((item, index) => ({
                id: index + 1,
                staff: item.injectionStaffName,
                vaccine: item.vaccineName,
                shipment: item.shipmentCode,
                vaccinePackage: item.vaccinePackageName,
                address: item.address,
                amount: item.amount + 'ml',
                time: new Date(item.injectionTime).toLocaleString(),
                injections: item.injections,
                pay: item.pay ? 'Đã thanh toán' : 'Chưa thanh toán',
                injection: item.injection ? 'Đã tiêm' : 'Chưa tiêm',
            }));
            const newData = {
                id: state.id,
                name: 'Báo cáo lịch tiêm',
                created: new Date(state.created).toLocaleString(),
                customer: state.customerName,
                date: new Date(state.date).toLocaleString(),
                columns: [
                    'Stt',
                    'Nhân viên tiêm',
                    'Vaccine',
                    'Lô hàng',
                    'Gói tiêm',
                    'Địa chỉ',
                    'Liều lượng',
                    'Ngày cập nhật',
                    'Thứ tự tiêm',
                    'Thanh toán',
                    'Tiêm',
                ],
                data: injectionDetails,
            };
            setReport(newData);
        })();
    }, []);
    return (
        <Document>
            <Page style={styles.page}>
                <Image style={styles.logo} src={images.logo} />
                {report && (
                    <>
                        <ReportTitle title={report.name} />
                        <ReportNo report={report} />
                        <ReportItemsTable report={report} />
                    </>
                )}
                <ReportFooter staffName={staffName} />
            </Page>
        </Document>
    );
};

export default Report;

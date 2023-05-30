import { Document, Font, Image, Page, StyleSheet } from '@react-pdf/renderer';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import images from '~/components/Images';
import { configStorage } from '~/configs';
import { entrySlip, order, pay } from './functions';
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
        padding: 10,
        lineHeight: 1.5,
        flexDirection: 'column',
    },
    logo: {
        width: 250,
        marginLeft: 'auto',
        marginRight: 'auto',
    },
});

const Report = ({ state, _order = false, _pay = false, _entrySlip = false }) => {
    const staffName = JSON.parse(Cookies.get(configStorage.login)).user.staffName;

    const [report, setReport] = useState();
    useEffect(() => {
        (async () => {
            if (_order) await order(state, setReport);
            else if (_entrySlip) await entrySlip(state, setReport);
            else if (_pay) await pay(state, setReport);
        })();
    }, []);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image style={styles.logo} src={images.logo} />
                {report && (
                    <>
                        <ReportTitle title={report.name} />
                        <ReportNo report={report} />
                        <ReportItemsTable pay={_pay} report={report} />
                    </>
                )}
                <ReportFooter staffName={staffName} />
            </Page>
        </Document>
    );
};

export default Report;

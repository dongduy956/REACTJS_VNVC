import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';
import ReportTableHeader from './ReportTableHeader';
import ReportTableRow from './ReportTableRow';
import ReportTableFooter from './ReportTableFooter';
import ReportDiscountPackage from './ReportDiscountPay';

const borderColor = '#90e5fc';
const tableRow = 5;
const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: borderColor,
    },
});

const ReportItemsTable = ({ report, pay = false }) => (
    <View style={styles.tableContainer}>
        <ReportTableHeader columns={report.columns} />
        <ReportTableRow report={report} />
        {pay && <ReportDiscountPackage report={report} />}
        <ReportTableFooter report={report} />
    </View>
);

export default ReportItemsTable;

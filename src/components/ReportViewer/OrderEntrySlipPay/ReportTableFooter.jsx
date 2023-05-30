import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#90e5fc';
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
        fontSize: 12,
        borderTopColor: borderColor,
        borderTopWidth: 1,
    },
    description: {
        width: '76%',
        textAlign: 'right',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingRight: 8,
        height: 20,
    },
    total: {
        width: '24%',
        textAlign: 'center',
        paddingRight: 8,
        height: 20,
    },
    note: {
        width: '100%',
        textAlign: 'center',
        paddingRight: 8,
        height: 20,
        color: 'red',
    },
});

const ReportTableFooter = ({ report }) => {
    return (
        <>
            <View style={styles.row}>
                <Text style={styles.description}>Tổng tiền:</Text>
                <Text style={styles.total}>{report.total}</Text>
            </View>
            {report.note && (
                <View style={styles.row}>
                    <Text style={styles.note}>{report.note}</Text>
                </View>
            )}
        </>
    );
};

export default ReportTableFooter;

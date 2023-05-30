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
    discount: {
        width: '24%',
        textAlign: 'center',
        paddingRight: 8,
        height: 20,
    },
});

const ReportDiscountPackage = ({ report }) => {
    return (
        <>
            {report.discountPackages.map((item) => (
                <View style={styles.row}>
                    <Text style={styles.description}>{item.name}</Text>
                    <Text style={styles.discount}>{item.discount}</Text>
                </View>
            ))}
        </>
    );
};

export default ReportDiscountPackage;

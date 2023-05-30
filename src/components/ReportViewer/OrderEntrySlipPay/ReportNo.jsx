import React from 'react';
import { Text, View } from '@react-pdf/renderer';

const ReportNo = ({ report }) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
                marginBottom: 20,
            }}
        >
            <View>
                {report.left.labels.map((item, index) => (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ minWidth: item.minWidth }}>{item.label}:</Text>
                        <Text>{report.left.values[index]}</Text>
                    </View>
                ))}
            </View>
            <View>
                {report.right.labels.map((item, index) => (
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ minWidth: item.minWidth }}>{item.label}:</Text>
                        <Text>{report.right.values[index]}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default ReportNo;

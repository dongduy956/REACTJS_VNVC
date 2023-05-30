import { Text, View } from '@react-pdf/renderer';
import React from 'react';

const ReportFooter = ({ staffName }) => (
    <View style={{ alignItems: 'flex-end', flexDirection: 'column', marginTop: 20 }}>
        <Text>
            Lập, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
        </Text>
        <Text style={{ fontSize: 8, marginRight: 37 }}>(Ký và ghi rõ họ tên)</Text>
        <Text style={{ marginRight: 30, marginTop: 25 }}>{staffName}</Text>
    </View>
);

export default ReportFooter;

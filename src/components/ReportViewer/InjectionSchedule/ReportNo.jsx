import React from 'react';
import { Text, View } from '@react-pdf/renderer';

const ReportNo = ({ report }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 20 }}>
        <View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ minWidth: 70 }}>Mã lịch:</Text>
                <Text>{report.id}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ minWidth: 70 }}>Ngày tạo: </Text>
                <Text>{report.created}</Text>
            </View>
        </View>
        <View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ minWidth: 70 }}>Khách hàng:</Text>
                <Text>{report.customer}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ minWidth: 70 }}>Ngày hẹn: </Text>
                <Text>{report.date}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ minWidth: 70 }}>Ngày in: </Text>
                <Text>{new Date().toLocaleString()}</Text>
            </View>
        </View>
    </View>
);

export default ReportNo;

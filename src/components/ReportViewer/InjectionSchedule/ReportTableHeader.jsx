import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    borderColor: borderColor,
    backgroundColor: "#bff0fd",
    borderRightWidth: 1,
    width: "20%",
  },
  column: {
    height: 20,
    textAlign: "center",
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
  },
});

const ReportTableHeader = ({ columns, check = false }) => (
  <>
    <View style={styles.container}>
      {columns.map((item, index) => (
        <Text
          style={[
            styles.column,
            index === columns.length - 1 && check && { borderBottomWidth: 0 },
          ]}
        >
          {item}
        </Text>
      ))}
      {!check &&  <Text style={styles.column}></Text>}
    </View>
  </>
);

export default ReportTableHeader;

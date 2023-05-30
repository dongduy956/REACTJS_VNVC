import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";
const styles = StyleSheet.create({
  row: {
    flexDirection: "column",
    width: "40%",
  },
  column: {
    borderBottomColor: borderColor,
    borderBottomWidth: 1,
    height: 20,
    textAlign: "center",
  },
});

const ReportTableRow = ({ items, check = false }) => {
  if (items.length === 1) items = [...items, {}];
  const rows = items.map((item, index) => (
    <>
      <View
        key={index}
        style={[
          styles.row,
          index === 0 && { borderRightWidth: 1, borderRightColor: borderColor },
        ]}
      >
        <Text style={styles.column}>{item.id}</Text>
        <Text style={styles.column}>{item.staff}</Text>
        <Text style={styles.column}>{item.vaccine}</Text>
        <Text style={styles.column}>{item.shipment}</Text>
        <Text style={styles.column}>{item.vaccinePackage}</Text>
        <Text style={styles.column}>{item.address}</Text>
        <Text style={styles.column}>{item.amount}</Text>
        <Text style={styles.column}>{item.time}</Text>
        <Text style={styles.column}>{item.injections}</Text>
        <Text style={styles.column}>{item.pay}</Text>
        <Text style={[styles.column, check && { borderBottomWidth: 0 }]}>
          {item.injection}
        </Text>
       {!check &&  <Text style={styles.column}></Text>}
      </View>
    </>
  ));
  return (
    <Fragment>
      {rows}
    </Fragment>
  );
};

export default ReportTableRow;

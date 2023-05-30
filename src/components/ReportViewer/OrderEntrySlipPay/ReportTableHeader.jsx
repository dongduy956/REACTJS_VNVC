import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";

const InvoiceTableHeader = ({ columns }) => {
  const propCss= columns.reduce(
    (temp, item, index) => ({
      ...temp,
      [`col${index}`]: { width: item.width },
    }),
    {
      container: {
        flexDirection: "row",
        backgroundColor: "#bff0fd",
      },
      column: {
        height: 20,
        textAlign: "center",
        borderRightColor: borderColor,
        borderRightWidth: 1,
      },
    }
  )
  
  const styles = StyleSheet.create(
   {...propCss}
  );
  return (
    <View style={styles.container}>
      {columns.map((item, index) => {
        return (
          <>
            <Text
              style={[
                styles[`col${index}`],
                styles.column,
                index === columns.length - 1 && { borderRightWidth: 0 },
              ]}
            >
              {item.name}
            </Text>
          </>
        );
      })}
    </View>
  );
};

export default InvoiceTableHeader;

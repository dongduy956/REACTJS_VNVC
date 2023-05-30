import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#90e5fc";

const InvoiceTableRow = ({ report }) => {
  const propCss = report.columns.reduce(
    (temp, item, index) => ({
      ...temp,
      [`col${index}`]: { width: item.width },
    }),
    {
      container: {
        flexDirection: "row",
        borderColor: borderColor,
        borderTopWidth: 1,
      },
      column: {
        height: 20,
        textAlign: "center",
        borderRightColor: borderColor,
        borderRightWidth: 1,
      },
    }
  );
  const styles = StyleSheet.create({ ...propCss });
  return (
    <>
      {report.data.map((items) => {
        return (
          <View style={styles.container}>
            {Object.values(items).map((item, index) => {
              return (
                <>
                  <Text
                    style={[
                      styles[`col${index}`],
                      styles.column,
                      index === report.columns.length - 1 && {
                        borderRightWidth: 0,
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </>
              );
            })}
          </View>
        );
      })}
    </>
  );
};

export default InvoiceTableRow;

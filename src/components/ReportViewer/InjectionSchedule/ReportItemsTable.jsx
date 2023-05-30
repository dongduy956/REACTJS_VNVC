import { StyleSheet, View } from "@react-pdf/renderer";
import React, { useEffect, useState } from "react";
import ReportTableHeader from "./ReportTableHeader";
import ReportTableRow from "./ReportTableRow";
const borderColor = "#90e5fc";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderColor: borderColor,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
});

const ReportItemsTable = ({ report }) => {
  const [data, setData] = useState({});
  useEffect(() => {
    const items = report.data.reduce(
      (temp, item, index) =>
        index % 2 === 0
          ? {
              ...temp,
              [`col${Object.keys(temp).length + 1}`]: [item],
            }
          : {
              ...temp,
              [`col${Object.keys(temp).length}`]: [
                ...temp[`col${Object.keys(temp).length}`],
                item,
              ],
            },
      {}
    );
    setData(items);
  }, []);
  return (
    <View style={{ flexDirection: "column" }}>
      {Object.values(data).map((items, index) => {
        return (
         <>
            <View
              key={index}
              style={[
                styles.tableContainer,
                index === 0 && { borderTopWidth: 1 },
                Object.keys(data).length - 1 === index && {
                  borderBottomWidth: 1,
                },
              ]}
            >
              <ReportTableHeader
                check={Object.keys(data).length - 1 === index}
                columns={report.columns}
              />
              <ReportTableRow
                check={Object.keys(data).length - 1 === index}
                items={items}
              />
              
            </View>
         </>
          
        );
      })}
    </View>
  );
};

export default ReportItemsTable;

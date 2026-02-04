import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { DataTable } from "react-native-paper";

const PaginationTable = ({
  data,
  keyField,
  row,
  columns,
  columns2,
  pageSize,
  searchText,
  rowEvents,
  nonDataIndication,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(pageSize);
  const from = currentPage * numberOfItemsPerPage;
  const to = data
    ? Math.min((currentPage + 1) * numberOfItemsPerPage, data.length)
    : 0;

  const [filteredData, setFilteredData] = useState(data);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!data) {
      setFilteredData([]);
      setCurrentPage(0);
      return;
    }

    const filtered = data.filter((item) => {
      for (let key in item) {
        if (
          item.hasOwnProperty(key) &&
          item[key] &&
          item[key].toString().toLowerCase().includes(searchText.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });

    setFilteredData(filtered);
    setCurrentPage(0);
  }, [data, searchText]);

  const getPageData = () => {
    if (!Array.isArray(filteredData) || filteredData.length === 0) {
      return [];
    }

    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredData.length);

    return filteredData.slice(startIndex, endIndex);
  };

  const renderHeader = () => {
    return (
      <DataTable.Header style={styles.header}>
        {columns.map((column, index) => (
          <DataTable.Title key={index} style={column.headerStyle}>
            <Text style={[column.headerTextStyle, { color: "white" }]}>
              {column.text}
            </Text>
          </DataTable.Title>
        ))}
      </DataTable.Header>
    );
  };

  const renderRow = ({ item, index }) => {
    const isEvenRow = index % 2 === 0;
    const rowStyle = isEvenRow ? styles.evenRow : styles.oddRow;
    const onPressRow = () => {
      if (rowEvents && typeof rowEvents === "function") {
        rowEvents(item);
      }
    };
    return (
      <React.Fragment key={index}>
        <DataTable.Row
          key={index}
          style={[styles.bodyTable, rowStyle]}
          onPress={onPressRow}
        >
          {columns.map((column, columnIndex) => (
            <DataTable.Cell
              key={columnIndex}
              style={[styles.column, column.headerStyle]}
            >
              <View style={[styles.column, column.rowStyle]}>
                {column.formatter && typeof column.formatter === "function" ? (
                  column.formatter(item[column.dataField], item, column)
                ) : (
                  <Text style={[styles.rowText, column.rowTextStyle]}>
                    {item[column.dataField] !== undefined
                      ? item[column.dataField]
                      : item[column.dataField.toLowerCase()]}
                  </Text>
                )}
              </View>
            </DataTable.Cell>
          ))}
        </DataTable.Row>
        {columns2.length > 0 && (
          <DataTable.Row
            key={`${index}-second`}
            style={[styles.bodyTable, rowStyle]}
          >
            {columns2.map((column, columnIndex) => (
              <DataTable.Cell
                key={columnIndex}
                style={[styles.column, column.headerStyle]}
              >
                <View style={[styles.column, column.rowStyle]}>
                  {column.formatter &&
                  typeof column.formatter === "function" ? (
                    column.formatter(item[column.dataField], item, column)
                  ) : (
                    <Text
                      numberOfLines={3}
                      ellipsizeMode="tail"
                      style={[styles.rowText, column.rowTextStyle]}
                    >
                      {item[column.dataField] !== undefined
                        ? item[column.dataField]
                        : item[column.dataField.toLowerCase()]}
                    </Text>
                  )}
                </View>
              </DataTable.Cell>
            ))}
          </DataTable.Row>
        )}
      </React.Fragment>
    );
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(filteredData.length / numberOfItemsPerPage);

    if (totalPages > 1) {
      return (
        <DataTable.Pagination
          style={styles.pagination}
          page={currentPage}
          numberOfPages={totalPages}
          onPageChange={handlePageChange}
          showFastPaginationControls={true}
          numberOfItemsPerPage={numberOfItemsPerPage}
          label={`Mostrando ${from + 1}-${to} de ${
            filteredData.length
          } resultados`}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      );
    } else {
      return null;
    }
  };

  if (!Array.isArray(filteredData) || filteredData.length === 0) {
    return (
      <ScrollView horizontal>
        <View>
          {renderHeader()}
          <Text style={styles.noData}>{nonDataIndication}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView horizontal>
      <View>
        <DataTable style={{ paddingHorizontal: 0 }}>
          {renderHeader()}
          {getPageData().map((item, index) => renderRow({ item, index }))}
        </DataTable>
        {renderPagination()}
      </View>
    </ScrollView>
  );
};

const styles = {
  header: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 0,
  },
  bodyTable: {
    paddingHorizontal: 0,
  },
  rowText: {
    maxHeight: 28,
    height: 28,
  },
  column: {
    maxHeight: 50,
    paddingVertical: 5,
  },
  rowStyle1: { maxHeight: 28, paddingBottom: 0 },
  evenRow: {
    backgroundColor: "#F5F5F5", // Color de fondo para filas pares
  },
  oddRow: {
    backgroundColor: "#FFFFFF", // Color de fondo para filas impares
  },
  pagination: {
    justifyContent: "flex-start",
    colorText: "#007AFF",
    paddingHorizontal: 0,
  },
  noData: {
    padding: 10,
  },
};

export default PaginationTable;

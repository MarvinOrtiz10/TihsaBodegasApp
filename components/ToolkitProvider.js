import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const ToolkitProvider = ({
  data,
  keyField,
  row,
  columns,
  pageSize,
  searchText,
  nonDataIndication,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortedData = () => {
    if (sortField) {
      const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) {
          return sortOrder === "asc" ? -1 : 1;
        } else if (aValue > bValue) {
          return sortOrder === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      });

      return sortedData;
    } else {
      return filteredData;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageData = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return []; // Manejo de datos no válidos, retornar arreglo vacío o manejar el error según sea necesario
    }

    const filteredData = data.filter((item) => {
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

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredData.slice(startIndex, endIndex);
  };
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        {columns.map((column, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.headerCell, column.headerStyle]} // Aplicar el estilo personalizado al headerCell
            onPress={() => handleSort(column.dataField)}
          >
            <Text style={[styles.headerText, column.headerTextStyle]}>
              {column.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRow = ({ item }) => {
    return (
      <View style={styles.row}>
        {columns.map((column, index) => (
          <View
            key={index}
            style={[styles.column, column.rowStyle]} // Aplicar el estilo personalizado al column
          >
            {typeof column.formatter === "function" ? (
              column.formatter(item, row)
            ) : (
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.rowText, column.rowTextStyle]}
              >
                {item[column.dataField] !== undefined
                  ? item[column.dataField]
                  : item[column.dataField.toLowerCase()]}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  /*const renderPagination = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return null; // No es necesario mostrar la paginación si no hay datos
    }

    const filteredData = data.filter(
      (item) =>
        item[row] && item[row].toLowerCase().includes(searchText.toLowerCase())
    );
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const pageNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );

    if (totalPages <= 1) {
      return null; // No es necesario mostrar la paginación si solo hay una página o menos
    }

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={styles.paginationArrow}
          onPress={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <Text
            style={[
              styles.paginationArrowText,
              currentPage === 1 && styles.disabledPaginationArrowText,
            ]}
          >
            {"<<"}
          </Text>
        </TouchableOpacity>
        {pageNumbers.map((pageNumber) => (
          <TouchableOpacity
            key={pageNumber}
            style={[
              styles.pageNumber,
              currentPage === pageNumber && styles.activePageNumber,
            ]}
            onPress={() => handlePageChange(pageNumber)}
          >
            <Text style={styles.pageNumberText}>{pageNumber}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.paginationArrow}
          onPress={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <Text
            style={[
              styles.paginationArrowText,
              currentPage === totalPages && styles.disabledPaginationArrowText,
            ]}
          >
            {">>"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };*/
  const renderPagination = () => {
    if (!Array.isArray(data) || data.length === 0) {
      return null; // No es necesario mostrar la paginación si no hay datos
    }

    const filteredData = data.filter(
      (item) =>
        item[row] && item[row].toLowerCase().includes(searchText.toLowerCase())
    );
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const pageNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );

    if (totalPages <= 1) {
      return null; // No es necesario mostrar la paginación si solo hay una página o menos
    }

    const visiblePageNumbers = pageNumbers.slice(0, 3); // Obtener las primeras 3 páginas
    const lastPageNumber = pageNumbers[totalPages - 1]; // Obtener el número de la última página

    const shouldShowEllipsis = totalPages > 5;

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={styles.paginationArrow}
          onPress={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          <Text
            style={[
              styles.paginationArrowText,
              currentPage === 1 && styles.disabledPaginationArrowText,
            ]}
          >
            {"<<"}
          </Text>
        </TouchableOpacity>
        {visiblePageNumbers.map((pageNumber) => (
          <TouchableOpacity
            key={pageNumber}
            style={[
              styles.pageNumber,
              currentPage === pageNumber && styles.activePageNumber,
            ]}
            onPress={() => handlePageChange(pageNumber)}
          >
            <Text style={styles.pageNumberText}>{pageNumber}</Text>
          </TouchableOpacity>
        ))}
        {shouldShowEllipsis && <Text style={styles.ellipsisText}>...</Text>}
        <TouchableOpacity
          key={lastPageNumber}
          style={[
            styles.pageNumber,
            currentPage === lastPageNumber && styles.activePageNumber,
          ]}
          onPress={() => handlePageChange(lastPageNumber)}
        >
          <Text style={styles.pageNumberText}>{lastPageNumber}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paginationArrow}
          onPress={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <Text
            style={[
              styles.paginationArrowText,
              currentPage === totalPages && styles.disabledPaginationArrowText,
            ]}
          >
            {">>"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (!Array.isArray(data) || data.length === 0) {
    return <Text>{nonDataIndication}</Text>; // Mostrar indicación de falta de datos
  }

  return (
    <ScrollView horizontal>
      <View>
        {renderHeader()}
        <FlatList
          data={getPageData()}
          keyExtractor={(item) =>
            (item[keyField.toLowerCase()] || "").toString()
          }
          renderItem={renderRow}
        />
        {renderPagination()}
      </View>
    </ScrollView>
  );
};

const styles = {
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 0,
    backgroundColor: "#007AFF",
  },
  headerCell: {
    flex: 1,
    alignItems: "left",
  },
  headerText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 12,
  },
  rowText: {
    fontSize: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "left",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  column: {
    padding: 5,
    fontSize: 8,
  },
  nonDataIndication: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    fontStyle: "italic",
    color: "gray",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  pageNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    //backgroundColor: "#ccc",
  },
  pageNumberText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  paginationArrow: {
    padding: 5,
  },
  paginationArrowText: {
    fontSize: 16,
    color: "#333",
  },
  disabledPaginationArrowText: {
    color: "gray",
  },
  activePageNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
};

export default ToolkitProvider;

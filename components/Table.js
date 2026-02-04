import React, { useState, useEffect } from "react";
import { DataTable, IconButton, Tooltip } from "react-native-paper";

const Table = ({ data, pagination }) => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPageList] = useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page ? page * itemsPerPage : 0;
  const to = page
    ? Math.min((page + 1) * itemsPerPage, data.length)
    : data.length;

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  function formatCurrency(amount, currencyCode) {
    if (typeof amount !== "number") {
      return ""; // o puedes retornar un valor predeterminado o lanzar un error
    }
    return amount.toLocaleString("es-GT", {
      style: "currency",
      currency: currencyCode,
    });
  }
  // Función para calcular la suma de una columna
  const sumColumn = (columnName) => {
    if (!data || data.length === 0) {
      return "0.00%";
    }

    if (
      columnName === "PorcentajeMeta" ||
      columnName === "PorcentajeAcumulado"
    ) {
      const hasNaN = data.some(
        (item) =>
          isNaN(parseFloat(item["PorcentajeMeta"])) ||
          isNaN(parseFloat(item["PorcentajeAcumulado"]))
      );
      if (hasNaN) return "0.00%";

      const metaSum = data.reduce((total, item) => total + item["Meta"], 0);
      const resultSum = data.reduce(
        (total, item) => total + item["Resultado"],
        0
      );
      if (metaSum === 0) return "0.00%";
      const percentage = (resultSum / metaSum) * 100;
      return isNaN(percentage) ? "0.00%" : percentage.toFixed(2) + "%";
    } else {
      const sum = data.reduce(
        (total, item) => total + parseFloat(item[columnName]),
        0
      );
      return formatCurrency(sum, "GTQ");
    }
  };

  return (
    <DataTable style={{ paddingHorizontal: 0 }}>
      <DataTable.Header style={{ paddingHorizontal: 0 }}>
        {Object.keys(data[0]).map((key, index) => (
          <DataTable.Title
            key={key}
            textStyle={{
              fontSize: 12,
              color: "white",
              fontWeight: "bold",
            }}
            style={{
              flex: index === 0 ? 0.8 : index == 3 || index == 4 ? 0.6 : 1,
              marginHorizontal: 0,
              justifyContent: "center",
              borderColor: "white",
              borderBottomWidth: 2,
              borderTopWidth: 2,
            }}
          >
            {key === "PorcentajeMeta"
              ? "%Meta"
              : key === "PorcentajeAcumulado"
              ? "%Acumulado"
              : key}
          </DataTable.Title>
        ))}
      </DataTable.Header>

      {data.slice(from, to).map((item, index) => (
        <DataTable.Row key={index} style={{ paddingHorizontal: 0 }}>
          {Object.values(item).map((value, index) => (
            <DataTable.Cell
              key={index}
              textStyle={{
                fontSize: 10,
                color: "white",
              }}
              style={{
                flex: index === 0 ? 0.8 : index == 3 || index == 4 ? 0.6 : 1,
                marginHorizontal: 0,
                justifyContent: "center",
                borderColor: "white",
              }}
              onPress={() => console.log(value)}
            >
              {index === 1
                ? formatCurrency(value, "GTQ")
                : index === 2
                ? formatCurrency(value, "GTQ")
                : value}
            </DataTable.Cell>
          ))}
        </DataTable.Row>
      ))}
      {/* Fila para mostrar totales */}
      <DataTable.Row key={"total"} style={{ paddingHorizontal: 0 }}>
        {Object.keys(data[0]).map((key, index) => (
          <DataTable.Cell
            key={index}
            textStyle={{
              fontSize: 10,
              color: "white",
              fontWeight: "bold",
            }}
            style={{
              flex: index === 0 ? 0.8 : index == 3 || index == 4 ? 0.6 : 1,
              marginHorizontal: 0,
              justifyContent: "center",
              borderColor: "white",
              borderTopWidth: 2,
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          >
            {index === 0
              ? "Total"
              : key === "PorcentajeMeta" || key === "PorcentajeAcumulado"
              ? `${sumColumn(key)}`
              : sumColumn(key)}
          </DataTable.Cell>
        ))}
      </DataTable.Row>

      {pagination && (
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(data.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} de ${data.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={"Filas por página"}
          style={{
            justifyContent: "center",
            flex: 1,
            color: "white",
          }}
          paginationControlRippleColor={{ color: "white" }}
          textStyle={{ color: "white" }}
        />
      )}
    </DataTable>
  );
};

export default Table;

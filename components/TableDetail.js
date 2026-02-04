import React, { useState, useEffect } from "react";
import { DataTable, IconButton, Tooltip } from "react-native-paper";
import { Dimensions, Text, View } from "react-native";
const { width, height } = Dimensions.get("screen");
const isMovil = width < 650 ? true : false;

const TableDetail = ({ data, pagination }) => {
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
    if (columnName === "Margen") {
      const sum = data.reduce((total, item) => {
        const value = parseFloat(item[columnName].replace("%", "")); // Eliminar el signo de porcentaje y convertir a número
        return isNaN(value) ? total : total + value;
      }, 0);
      const average = sum / data.length;
      return isNaN(average) ? "0.00%" : Math.ceil((average * 100) / 100) + "%";
    } else {
      const sum = data.reduce(
        (total, item) => total + parseFloat(item[columnName]),
        0
      );
      return formatCurrency(sum, "GTQ");
    }
  };
  function calculateMargin(data) {
    const sumUtilidad = data.reduce((total, item) => {
      const value = parseFloat(item.Utilidad);
      return isNaN(value) ? total : total + value;
    }, 0);

    const sumTotal = data.reduce((total, item) => {
      const value = parseFloat(item.Total);
      return isNaN(value) ? total : total + value;
    }, 0);

    if (sumTotal === 0) {
      return "0%";
    }

    const margin = (sumUtilidad / sumTotal) * 100;
    return isNaN(margin) ? "0%" : Math.floor(margin) + "%";
  }
  function convertirFormatoFecha(fecha) {
    // Parsea la fecha en formato ISO 8601
    const fechaISO = new Date(fecha);

    // Obtiene el día, mes y año
    const dia = fechaISO.getDate();
    const mes = fechaISO.getMonth() + 1; // Los meses van de 0 a 11, por eso se suma 1
    const año = fechaISO.getFullYear();

    // Formatea la fecha en formato dd/mm/yyyy
    const fechaFormateada = `${dia < 10 ? "0" : ""}${dia}/${
      mes < 10 ? "0" : ""
    }${mes}/${año}`;

    return fechaFormateada;
  }
  function formatCurrency(amount, currencyCode) {
    if (typeof amount !== "number") {
      return ""; // o puedes retornar un valor predeterminado o lanzar un error
    }
    return amount.toLocaleString("es-GT", {
      style: "currency",
      currency: currencyCode,
    });
  }
  return (
    <DataTable style={{ paddingHorizontal: 0 }}>
      <DataTable.Header style={{ paddingHorizontal: 0 }}>
        {Object.keys(data[0]).map((key, index) => {
          const anchoColumna =
            index == 0 || index == 1 ? 70 : index == 2 ? 120 : 90;
          const anchoColumnaTablet =
            index == 0 || index == 1 ? 80 : index == 2 ? 220 : 90;
          return (
            <DataTable.Title
              key={key}
              style={{
                flex: 1,
                width: isMovil ? anchoColumna : anchoColumnaTablet,
                marginHorizontal: 0,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "white",
                borderBottomWidth: 2,
                borderTopWidth: 2,
              }}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 30,
                }}
              >
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 12,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {key === "NumeroRegistro"
                    ? "Factura"
                    : key === "Nombre"
                    ? "Cliente"
                    : key === "Total"
                    ? "Valor Factura"
                    : key === "Subtotal"
                    ? "Venta sin iva"
                    : key === "Utilidad"
                    ? "Utilidad Bruta"
                    : key}
                </Text>
              </View>
            </DataTable.Title>
          );
        })}
      </DataTable.Header>
      {data.slice(from, to).map((item, index) => (
        <DataTable.Row key={index} style={{ paddingHorizontal: 0 }}>
          {Object.values(item).map((value, index) => {
            const anchoColumna =
              index == 0 || index == 1 ? 70 : index == 2 ? 120 : 90;
            const anchoColumnaTablet =
              index == 0 || index == 1 ? 80 : index == 2 ? 220 : 90;
            return (
              <DataTable.Cell
                key={index}
                style={{
                  flex: 1,
                  width: isMovil ? anchoColumna : anchoColumnaTablet,
                  marginHorizontal: 0,
                  justifyContent: "center",
                  borderColor: "white",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: index === 2 ? "flex-start" : "center",
                  }}
                >
                  <Text
                    numberOfLines={3}
                    style={{
                      fontSize: 10,
                      color: "white",
                    }}
                  >
                    {index === 0
                      ? convertirFormatoFecha(value)
                      : index == 3 || index == 4 || index == 5
                      ? formatCurrency(value, "GTQ")
                      : value}
                  </Text>
                </View>
              </DataTable.Cell>
            );
          })}
        </DataTable.Row>
      ))}
      {/* Fila para mostrar totales */}
      <DataTable.Row key={"total"} style={{ paddingHorizontal: 0 }}>
        {Object.keys(data[0]).map((key, index) => {
          const anchoColumna =
            index == 0 || index == 1 ? 70 : index == 2 ? 120 : 90;
          const anchoColumnaTablet =
            index == 0 || index == 1 ? 80 : index == 2 ? 220 : 90;
          return (
            <DataTable.Cell
              key={index}
              textStyle={{
                fontSize: index == 2 ? 12 : 10,
                color: "white",
                fontWeight: "bold",
              }}
              style={{
                flex: 1,
                width: isMovil ? anchoColumna : anchoColumnaTablet,
                marginHorizontal: 0,
                justifyContent: "center",
                borderColor: "white",
                borderTopWidth: 2,
                backgroundColor: "rgba(255,255,255,0.2)",
              }}
            >
              {index === 0 || index === 1
                ? ""
                : index == 2
                ? "Total Ventas"
                : key === "Margen"
                ? `${calculateMargin(data)}`
                : sumColumn(key)}
            </DataTable.Cell>
          );
        })}
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

export default TableDetail;

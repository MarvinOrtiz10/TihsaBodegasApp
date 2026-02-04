import React, { useState, useEffect } from "react";
import { DataTable } from "react-native-paper";
import { Dimensions, Text, View } from "react-native";

const { width } = Dimensions.get("screen");
const isMovil = width < 650;

const TableTotal = ({
  data = [],
  data2 = [],
  data3 = [],
  data4 = [],
  pagination,
}) => {
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

  const formatCurrency = (amount, currencyCode) => {
    if (typeof amount !== "number") {
      return ""; // o puedes retornar un valor predeterminado o lanzar un error
    }
    return amount.toLocaleString("es-GT", {
      style: "currency",
      currency: currencyCode,
    });
  };

  const sumColumn = (columnName) => {
    if (columnName === "Margen") {
      const sum = data.reduce((total, item) => {
        const value = parseFloat(item[columnName].replace("%", ""));
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

  const convertirFormatoFecha = (fecha) => {
    const fechaISO = new Date(fecha);
    const dia = fechaISO.getDate();
    const mes = fechaISO.getMonth() + 1;
    const año = fechaISO.getFullYear();
    return `${dia < 10 ? "0" : ""}${dia}/${mes < 10 ? "0" : ""}${mes}/${año}`;
  };

  const calculateTotal = (columnName, data1, data2, data3, data4) => {
    const sumData = (data, key) => {
      return data.reduce((total, item) => {
        const value = parseFloat(item[key]) || 0;
        return total + value;
      }, 0);
    };

    const totalData1 = sumData(data1, columnName);
    const totalData2 = sumData(data2, columnName);
    const totalData3 = sumData(data3, columnName);
    const totalData4 = sumData(data4, columnName);
    const finalTotal = totalData1 + totalData2 - (totalData3 + totalData4);

    if (columnName === "Margen") {
      const totalUtilidad =
        sumData(data1, "Utilidad") +
        sumData(data2, "Utilidad") -
        sumData(data3, "Utilidad") -
        sumData(data4, "Utilidad");
      const totalSubtotal =
        sumData(data1, "Subtotal") +
        sumData(data2, "Subtotal") -
        sumData(data3, "Subtotal") -
        sumData(data4, "Subtotal");
      const margen =
        totalSubtotal === 0 ? 0 : (totalUtilidad / totalSubtotal) * 100;
      return Math.ceil(margen) + "%";
    }

    return finalTotal;
  };

  const sumColumn2 = (data, columnName) => {
    if (columnName === "Margen") {
      const sumUtilidad = data.reduce((total, item) => {
        const value = parseFloat(item.Utilidad);
        return isNaN(value) ? total : total + value;
      }, 0);
      const sumSubtotal = data.reduce((total, item) => {
        const value = parseFloat(item.Subtotal);
        return isNaN(value) ? total : total + value;
      }, 0);
      if (sumSubtotal === 0) {
        return "0%";
      }
      const margin = (sumUtilidad / sumSubtotal) * 100;
      return isNaN(margin) ? "0%" : Math.floor(margin) + "%";
    } else {
      const sum = data.reduce((total, item) => {
        const value = parseFloat(item[columnName]);
        return isNaN(value) ? total : total + value;
      }, 0);
      return isNaN(sum)
        ? "Q0.00"
        : sum.toLocaleString("es-GT", { style: "currency", currency: "GTQ" });
    }
  };

  return (
    <DataTable style={{ paddingHorizontal: 0 }}>
      <DataTable.Header style={{ paddingHorizontal: 0 }}>
        {Object.keys(data[0] || {}).map((key, index) => {
          if (index === 0 || index === 1) {
            return null;
          }
          const anchoColumna = index === 2 ? 120 : 90;
          const anchoColumnaTablet = index === 2 ? 220 : 130;
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
                  {key === "Margen"
                    ? "Margen"
                    : key === "Nombre"
                    ? "Tipo"
                    : key === "Total"
                    ? "Total"
                    : key === "Subtotal"
                    ? "Venta sin iva"
                    : key === "Utilidad"
                    ? "Utilidad"
                    : ""}
                </Text>
              </View>
            </DataTable.Title>
          );
        })}
      </DataTable.Header>

      {data.length > 0 && (
        <DataTable.Row key={"totalFacTihsa"} style={{ paddingHorizontal: 0 }}>
          {Object.keys(data[0] || {}).map((key, index) => {
            if (index === 0 || index === 1) {
              return null;
            }
            const anchoColumna = index === 2 ? 120 : 90;
            const anchoColumnaTablet = index === 2 ? 220 : 130;
            return (
              <DataTable.Cell
                key={index}
                textStyle={{
                  fontSize: 10,
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
                  : index === 2
                  ? "Facturas Tihsa"
                  : key === "Margen"
                  ? `${sumColumn(key)}`
                  : sumColumn(key)}
              </DataTable.Cell>
            );
          })}
        </DataTable.Row>
      )}

      {data2.length > 0 && (
        <DataTable.Row
          key={"totalFacMacpartes"}
          style={{ paddingHorizontal: 0 }}
        >
          {Object.keys(data2[0] || {}).map((key, index) => {
            if (index === 0 || index === 1) {
              return null;
            }
            const anchoColumna = index === 2 ? 120 : 90;
            const anchoColumnaTablet = index === 2 ? 220 : 130;
            return (
              <DataTable.Cell
                key={index}
                textStyle={{
                  fontSize: 10,
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
                  : index === 2
                  ? "Facturas Macpartes"
                  : key === "Margen"
                  ? `${sumColumn2(data2, key)}`
                  : sumColumn2(data2, key)}
              </DataTable.Cell>
            );
          })}
        </DataTable.Row>
      )}

      {data3.length > 0 && (
        <DataTable.Row key={"totalNCredito"} style={{ paddingHorizontal: 0 }}>
          {Object.keys(data3[0] || {}).map((key, index) => {
            if (index === 0 || index === 1) {
              return null;
            }
            const anchoColumna = index === 2 ? 120 : 90;
            const anchoColumnaTablet = index === 2 ? 220 : 130;
            return (
              <DataTable.Cell
                key={index}
                textStyle={{
                  fontSize: 10,
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
                  : index === 2
                  ? "Notas de Crédito Tihsa"
                  : key === "Margen"
                  ? `${sumColumn2(data3, key)}`
                  : sumColumn2(data3, key)}
              </DataTable.Cell>
            );
          })}
        </DataTable.Row>
      )}

      {data4.length > 0 && (
        <DataTable.Row
          key={"totalNCreditoMac"}
          style={{ paddingHorizontal: 0 }}
        >
          {Object.keys(data4[0] || {}).map((key, index) => {
            if (index === 0 || index === 1) {
              return null;
            }
            const anchoColumna = index === 2 ? 120 : 90;
            const anchoColumnaTablet = index === 2 ? 220 : 130;
            return (
              <DataTable.Cell
                key={index}
                textStyle={{
                  fontSize: 10,
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
                  : index === 2
                  ? "Notas de Crédito Macpartes"
                  : key === "Margen"
                  ? `${sumColumn2(data4, key)}`
                  : sumColumn2(data4, key)}
              </DataTable.Cell>
            );
          })}
        </DataTable.Row>
      )}

      {data.length > 0 &&
        data2.length > 0 &&
        data3.length > 0 &&
        data4.length > 0 && (
          <DataTable.Row key={"totalFinal"} style={{ paddingHorizontal: 0 }}>
            {Object.keys(data[0] || {}).map((key, index) => {
              if (index === 0 || index === 1) {
                return null;
              }
              const anchoColumna = index === 2 ? 120 : 90;
              const anchoColumnaTablet = index === 2 ? 220 : 130;
              return (
                <DataTable.Cell
                  key={index}
                  textStyle={{
                    fontSize: 10,
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
                    : index === 2
                    ? "Total Final"
                    : key === "Margen"
                    ? `${calculateTotal(key, data, data2, data3, data4)}`
                    : formatCurrency(
                        calculateTotal(key, data, data2, data3, data4),
                        "GTQ"
                      )}
                </DataTable.Cell>
              );
            })}
          </DataTable.Row>
        )}

      {data.length > 0 && (
        <DataTable.Row key={"total"} style={{ paddingHorizontal: 0 }}>
          {Object.keys(data[0]).map((key, index) => {
            if (index === 0 || index === 1) {
              return null;
            }
            const anchoColumna = index == 2 ? 120 : 90;
            const anchoColumnaTablet = index == 2 ? 220 : 130;
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
                  backgroundColor: "rgba(173, 216, 230, 0.5)",
                }}
              >
                {index === 0 || index === 1
                  ? ""
                  : index === 2
                  ? "Total General"
                  : key === "Margen"
                  ? calculateTotal(key, data, data2, data3, data4)
                  : formatCurrency(
                      Number(
                        calculateTotal(key, data, data2, data3, data4).toFixed(
                          2
                        )
                      ),
                      "GTQ"
                    )}
              </DataTable.Cell>
            );
          })}
        </DataTable.Row>
      )}
    </DataTable>
  );
};

export default TableTotal;

/* V1.0 Necesita mejoras si la data está vacía

import React, { useState, useEffect } from "react";
import { DataTable, IconButton, Tooltip } from "react-native-paper";
import { Dimensions, Text, View } from "react-native";
const { width, height } = Dimensions.get("screen");
const isMovil = width < 650 ? true : false;

const TableTotal = ({ data, data2, data3, data4, pagination }) => {
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
  // Función para calcular la suma de una columna en un conjunto de datos
  function calculateTotal(columnName, data1, data2, data3, data4) {
    const sumData = (data, key) => {
      return data.reduce((total, item) => {
        const value = parseFloat(item[key]) || 0;
        return total + value;
      }, 0);
    };

    const totalData1 = sumData(data1, columnName);
    const totalData2 = sumData(data2, columnName);
    const totalData3 = sumData(data3, columnName);
    const totalData4 = sumData(data4, columnName);

    const finalTotal = totalData1 + totalData2 - (totalData3 + totalData4);

    if (columnName === "Margen") {
      const totalUtilidad =
        sumData(data1, "Utilidad") +
        sumData(data2, "Utilidad") -
        sumData(data3, "Utilidad") -
        sumData(data4, "Utilidad");
      const totalSubtotal =
        sumData(data1, "Subtotal") +
        sumData(data2, "Subtotal") -
        sumData(data3, "Subtotal") -
        sumData(data4, "Subtotal");
      const margen =
        totalSubtotal === 0 ? 0 : (totalUtilidad / totalSubtotal) * 100;
      return Math.ceil(margen) + "%";
    }

    return finalTotal;
  }

  function sumColumn2(data, columnName) {
    if (columnName === "Margen") {
      const sumUtilidad = data.reduce((total, item) => {
        const value = parseFloat(item.Utilidad);
        return isNaN(value) ? total : total + value;
      }, 0);

      const sumSubtotal = data.reduce((total, item) => {
        const value = parseFloat(item.Subtotal);
        return isNaN(value) ? total : total + value;
      }, 0);

      if (sumSubtotal === 0) {
        return "0%";
      }

      const margin = (sumUtilidad / sumSubtotal) * 100;
      return isNaN(margin) ? "0%" : Math.floor(margin) + "%";
    } else {
      const sum = data.reduce((total, item) => {
        const value = parseFloat(item[columnName]);
        return isNaN(value) ? total : total + value;
      }, 0);
      return isNaN(sum)
        ? "Q0.00"
        : sum.toLocaleString("es-GT", { style: "currency", currency: "GTQ" });
    }
  }
  return (
    <DataTable style={{ paddingHorizontal: 0 }}>
      <DataTable.Header style={{ paddingHorizontal: 0 }}>
        {Object.keys(data[0]).map((key, index) => {
          if (index === 0 || index === 1) {
            return null; // No renderizar las columnas en los índices 0 y 1
          }
          const anchoColumna = index == 2 ? 120 : 90;
          const anchoColumnaTablet = index == 2 ? 220 : 130;
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
                  {key === "Margen"
                    ? "Margen"
                    : key === "Nombre"
                    ? "Tipo"
                    : key === "Total"
                    ? "Total"
                    : key === "Subtotal"
                    ? "Venta sin iva"
                    : key === "Utilidad"
                    ? "Utilidad"
                    : ""}
                </Text>
              </View>
            </DataTable.Title>
          );
        })}
      </DataTable.Header>
      <DataTable.Row key={"totalFacTihsa"} style={{ paddingHorizontal: 0 }}>
        {Object.keys(data[0]).map((key, index) => {
          if (index === 0 || index === 1) {
            return null; // No renderizar las columnas en los índices 0 y 1
          }
          const anchoColumna = index == 2 ? 120 : 90;
          const anchoColumnaTablet = index == 2 ? 220 : 130;
          return (
            <DataTable.Cell
              key={index}
              textStyle={{
                fontSize: 10,
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
                ? "Facturas Tihsa"
                : key === "Margen"
                ? `${sumColumn(key)}`
                : sumColumn(key)}
            </DataTable.Cell>
          );
        })}
      </DataTable.Row>
      <DataTable.Row key={"totalFacMacpartes"} style={{ paddingHorizontal: 0 }}>
        {Object.keys(data2[0]).map((key, index) => {
          if (index === 0 || index === 1) {
            return null; // No renderizar las columnas en los índices 0 y 1
          }
          const anchoColumna = index == 2 ? 120 : 90;
          const anchoColumnaTablet = index == 2 ? 220 : 130;
          return (
            <DataTable.Cell
              key={index}
              textStyle={{
                fontSize: 10,
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
                : index === 2
                ? "Facturas Macpartes"
                : sumColumn2(data2, key)}
            </DataTable.Cell>
          );
        })}
      </DataTable.Row>
      {data3.length !== 0 && (
        <DataTable.Row key={"totalNC"} style={{ paddingHorizontal: 0 }}>
          {Object.keys(data3[0]).map((key, index) => {
            if (index === 0 || index === 1) {
              return null; // No renderizar las columnas en los índices 0 y 1
            }
            const anchoColumna = index == 2 ? 120 : 90;
            const anchoColumnaTablet = index == 2 ? 220 : 130;
            return (
              <DataTable.Cell
                key={index}
                textStyle={{
                  fontSize: 10,
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
                  ? "Notas de crédito Tihsa"
                  : sumColumn2(data3, key)}
              </DataTable.Cell>
            );
          })}
        </DataTable.Row>
      )}
      {data4.length !== 0 && (
        <DataTable.Row key={"totalNCMac"} style={{ paddingHorizontal: 0 }}>
          {Object.keys(data4[0]).map((key, index) => {
            if (index === 0 || index === 1) {
              return null; // No renderizar las columnas en los índices 0 y 1
            }
            const anchoColumna = index == 2 ? 120 : 90;
            const anchoColumnaTablet = index == 2 ? 220 : 130;
            return (
              <DataTable.Cell
                key={index}
                textStyle={{
                  fontSize: 10,
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
                  ? "Notas de crédito Macpartes"
                  : sumColumn2(data4, key)}
              </DataTable.Cell>
            );
          })}
        </DataTable.Row>
      )}

      <DataTable.Row key={"total"} style={{ paddingHorizontal: 0 }}>
        {Object.keys(data[0]).map((key, index) => {
          if (index === 0 || index === 1) {
            return null; // No renderizar las columnas en los índices 0 y 1
          }
          const anchoColumna = index == 2 ? 120 : 90;
          const anchoColumnaTablet = index == 2 ? 220 : 130;
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
                backgroundColor: "rgba(173, 216, 230, 0.5)",
              }}
            >
              {index === 0 || index === 1
                ? ""
                : index === 2
                ? "Total General"
                : key === "Margen"
                ? calculateTotal(key, data, data2, data3, data4)
                : formatCurrency(
                    Number(
                      calculateTotal(key, data, data2, data3, data4).toFixed(2)
                    ),
                    "GTQ"
                  )}
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

export default TableTotal;
 */

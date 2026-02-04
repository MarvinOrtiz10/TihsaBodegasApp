import React from "react";
import { Dimensions, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
const { width, height } = Dimensions.get("screen");
import { BlurView } from "expo-blur";
const isMovil = width < 650 ? true : false;

const DynamicBarChart = ({ data }) => {
  // Calcular el valor máximo de los datos
  let maxBarDataValue = 10000;
  if (data.some((bar) => bar.value !== 0)) {
    maxBarDataValue = Math.max(...data.map((bar) => bar.value));
  }
  // Agregar un 10% adicional al valor máximo
  maxBarDataValue += maxBarDataValue * 0.1;

  // Definir los valores de los pasos según el rango del valor máximo
  let stepValue;
  if (maxBarDataValue <= 10000) {
    stepValue = 1000;
  } else if (maxBarDataValue > 10000 && maxBarDataValue <= 100000) {
    stepValue = 10000;
  } else if (maxBarDataValue > 100000 && maxBarDataValue <= 500000) {
    stepValue = 50000;
  } else {
    stepValue = 100000;
  }

  // Calcular el próximo valor de stepValue después de agregar el 10% adicional
  let nextStepValue;
  if (stepValue <= 10000) {
    nextStepValue = 1000;
  } else if (stepValue <= 100000) {
    nextStepValue = 10000;
  } else if (stepValue <= 500000) {
    nextStepValue = 50000;
  } else {
    nextStepValue = 100000;
  }

  // Redondear maxBarDataValue al próximo múltiplo de stepValue
  maxBarDataValue = Math.ceil(maxBarDataValue / nextStepValue) * nextStepValue;

  // Determinar el número de secciones en el eje y como múltiplo de 2 y sin decimales
  let numberOfSections = Math.floor(maxBarDataValue / (2 * stepValue)) * 2;

  const formatCurrency = (value) => {
    // Aplicar formato de moneda para Guatemala (GTQ)
    return value
      .toLocaleString("es-GT", { style: "currency", currency: "GTQ" })
      .replace(/\u00A0/g, ""); // Remover espacios no deseados
  };
  let barWidth;
  let xAxisLabelFontSize;
  let initialSpacingSize;
  if (data.length <= 2) {
    barWidth = isMovil ? 100 : 150; // Ancho máximo para 2 o menos datos
    xAxisLabelFontSize = 14;
    initialSpacingSize = 20;
  } else if (data.length >= 24) {
    barWidth = isMovil ? 30 : 50; // Ancho mínimo para 24 o más datos
    xAxisLabelFontSize = 8;
    initialSpacingSize = 0;
  } else {
    barWidth = isMovil ? 60 : 85//1000 / data.length; // Ancho variable para más de 2 y menos de 24 datos
    xAxisLabelFontSize = 8;
    initialSpacingSize = 10;
  }
  let yAxisLabels = Array.from({ length: numberOfSections + 1 }, (_, i) =>
    Math.ceil(i * stepValue)
  );

  const xAxisLabelTextStyle = {
    color: "lightgray",
    textAlign: "center",
    fontSize: xAxisLabelFontSize,
  };
  let xAxisLabelTexts = data.map((item) =>
    data.length >= 6 ? item.label.substring(0, 3) : item.label
  );
  return (
    <BarChart
      isAnimated
      data={data}
      width={isMovil ? width * 0.7 : width * 0.85}
      height={isMovil ? 220 : 300}
      barWidth={barWidth}
      initialSpacing={initialSpacingSize}
      spacing={5}
      barBorderRadius={4}
      yAxisThickness={0}
      xAxisType={"dashed"}
      xAxisColor={"lightgray"}
      yAxisTextStyle={{ color: "lightgray", fontSize: 8 }}
      stepValue={stepValue}
      maxValue={maxBarDataValue}
      noOfSections={numberOfSections}
      yAxisLabelTexts={yAxisLabels}
      // Cambia el formato de acuerdo a tus necesidades
      yAxisLabelWidth={40}
      xAxisLabelTexts={xAxisLabelTexts}
      xAxisLabelTextStyle={xAxisLabelTextStyle}
      showLine
      lineConfig={{
        color: "#ffd60a", //"#F29C6E",
        thickness: 3,
        curved: true,
        hideDataPoints: true,
        isAnimated: true,
        shiftY: 10,
      }}
      renderTooltip={(item, index) => {
        return (
          <BlurView
            intensity={20}
            tint="light"
            style={{
              backgroundColor: "rgba(255,255,255,0.5)",
              marginBottom: 10,
              marginLeft: -2,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 15,
              overflow: "hidden",
            }}
          >
            <Text style={{ color: "white", fontSize: isMovil ? 8 : 10 }}>Resultado</Text>
            <Text style={{ color: "white", fontSize: isMovil ? 8 : 10 }}>
              {formatCurrency(item.label, "GTQ")}
            </Text>
            <Text style={{ color: "white", fontSize: isMovil ? 10 : 12 }}>
              {formatCurrency(item.value, "GTQ")}
            </Text>
          </BlurView>
        );
      }}
    />
  );
};

export default DynamicBarChart;

import { useEffect, useState, useRef } from "react";
import { Animated, Dimensions } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

const ProgressChartAnimation = ({
  data,
  width,
  height,
  strokeWidth,
  radius,
}) => {
  const initialData = data.data;
  const animatedValues = initialData.map(
    () => useRef(new Animated.Value(0)).current
  );

  const [progressData, setProgressData] = useState(data);

  useEffect(() => {
    const animations = initialData.map((item, index) => {
      return Animated.timing(animatedValues[index], {
        toValue: item,
        duration: 1000,
        useNativeDriver: false,
      });
    });

    Animated.parallel(animations).start();

    animatedValues.forEach((val, index) => {
      val.addListener(({ value }) => {
        setProgressData((prevData) => {
          const newData = [...prevData.data];
          newData[index] = value;
          return { ...prevData, data: newData };
        });
      });
    });

    // Clean up the listener
    return () => {
      animatedValues.forEach((val) => val.removeAllListeners());
    };
  }, [data]);

  return (
    progressData && (
      <ProgressChart
        data={progressData}
        width={width}
        height={height}
        strokeWidth={strokeWidth}
        radius={radius}
        chartConfig={{
          backgroundColor: "red",
          backgroundGradientFrom: "#1E2923",
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: "#08130D",
          backgroundGradientToOpacity: 0,
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Color de fondo de los puntos de datos
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

          propsForLabels: {
            fontSize: 8,
          },
          propsForDots: {
            r: "2",
            strokeWidth: "1",
            stroke: "#218838",
          },
        }}
        hideLegend={true}
        withCustomBarColorFromData={true}
      />
    )
  );
};

export default ProgressChartAnimation;

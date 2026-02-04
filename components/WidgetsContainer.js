import React, { useRef, useState } from "react";
import { View, ScrollView, Dimensions, StyleSheet } from "react-native";

const WidgetContainer = ({ children, orientation }) => {
  const scrollViewRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const handleSwipe = (direction) => {
    if (orientation === "horizontal") {
      const scrollX = direction === "right" ? screenWidth : -screenWidth;
      scrollViewRef.current.scrollTo({
        x: scrollViewRef.current.contentOffset.x + scrollX,
        animated: true,
      });
    } else if (orientation === "vertical") {
      const scrollY = direction === "down" ? screenHeight : -screenHeight;
      scrollViewRef.current.scrollTo({
        y: scrollViewRef.current.contentOffset.y + scrollY,
        animated: true,
      });
    }
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index =
      orientation === "horizontal"
        ? Math.round(contentOffset.x / screenWidth)
        : Math.round(contentOffset.y / screenHeight);
    setSelectedIndex(index);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        horizontal={orientation === "horizontal"}
        vertical={orientation === "vertical"}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
        onScroll={handleScroll}
      >
        {React.Children.map(children, (child) => (
          <View style={{ flex: 1, paddingVertical: 10 }}>{child}</View>
        ))}
      </ScrollView>
      {children.length > 1 && (
        <View style={styles.pagination}>
          {children.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === selectedIndex ? "#93FCF8" : "#f6fff8",
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default WidgetContainer;

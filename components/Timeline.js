import { Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
const TimelineItem = ({
    active,
    color,
    icon,
    title,
    usuario,
    fecha,
    hora,
  }) => {
    return (
      <View style={{ flexDirection: "row", marginBottom: 25 }}>
        {/* Línea + punto */}
        <View style={{ alignItems: "center", width: 30 }}>
          {/* Línea vertical */}
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: 2,
              backgroundColor: "#E5E7EB",
            }}
          />

          {/* Nodo */}
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: active ? color : "#E5E7EB",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1,
            }}
          >
            <FontAwesomeIcon
              icon={icon}
              size={12}
              color={active ? "white" : "#9CA3AF"}
            />
          </View>
        </View>

        {/* Contenido */}
        <View
          style={{
            flex: 1,
            paddingLeft: 10,
            borderLeftWidth: 2,
            borderLeftColor: active ? color : "#E5E7EB",
            paddingBottom: 10,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: active ? color : "#9CA3AF",
            }}
          >
            {title}
          </Text>

          {active && (
            <>
              <Text>{usuario || "-"}</Text>

              {/* Fecha */}
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                {fecha instanceof Date
                  ? fecha.toLocaleDateString("es-GT", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : fecha || "-"}
              </Text>

              {/* Hora */}
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                {hora instanceof Date
                  ? hora.toLocaleTimeString("es-GT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : hora || "-"}
              </Text>
            </>
          )}
        </View>
      </View>
    );
  };

  export default TimelineItem;
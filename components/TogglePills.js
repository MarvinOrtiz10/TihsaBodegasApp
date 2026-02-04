import React, { useState } from "react";
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const { width, height } = Dimensions.get("screen");

const TogglePills = ({ onSwitchToggle }) => {
  const [targetState, setTargetState] = useState(false);

  const handleToggleOption = () => {
    setTargetState(!targetState);
    onSwitchToggle(!targetState); // Llama a la función prop para actualizar el estado en el componente principal
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.pill, !targetState && styles.activePill]}
        onPress={handleToggleOption}
      >
        <Text style={[styles.pillText, !targetState && styles.activePillText]}>
          Crédito/débito
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.pill, targetState && styles.activePill]}
        onPress={handleToggleOption}
      >
        <Text style={[styles.pillText, targetState && styles.activePillText]}>
          Visacuotas
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#007AFF",
    borderRadius: 50,
    padding: 5,
    flexDirection: "row",
    marginBottom: 10,
  },
  pill: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 0,
    backgroundColor: "#007AFF",
  },
  activePill: {
    backgroundColor: "#FED30B",
  },
  pillText: {
    textAlign: "center",
    color: "rgba(236,236,241,1)",
    fontWeight: 500,
  },
  activePillText: {
    color: "#0f334f",
  },
});

export default TogglePills;

/* Versión 1.1 Estable created by Ing. Ortiz. 
import React, { useState } from "react";
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const { width, height } = Dimensions.get("screen");

const options = [
  { id: 1, label: "Crédito/débito" },
  { id: 2, label: "Visacuotas" },
];

const TogglePills = ({ onSwitchToggle }) => {
  const [selectedOption, setSelectedOption] = useState(options[0].id);

  const handleToggleOption = (id) => {
    setSelectedOption(id);
    onSwitchToggle(id); // Call the prop function to update the state in the parent component
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.pill,
            selectedOption === option.id && styles.activePill,
          ]}
          onPress={() => handleToggleOption(option.id)}
        >
          <Text
            style={[
              styles.pillText,
              selectedOption === option.id && styles.activePillText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#202123",
    backgroundColor: "#007AFF",
    borderRadius: 50,
    padding: 5,
    flexDirection: "row",
    marginBottom: 10,
  },
  pill: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 0,
    backgroundColor: "#007AFF", //"#202123",
  },
  activePill: {
    backgroundColor: "#FED30B", //"rgba(64,65,79,1)",
  },
  pillText: {
    textAlign: "center",
    color: "rgba(236,236,241,1)",
    fontWeight: 500,
  },
  activePillText: {
    color: "#0f334f",
  },
});

export default TogglePills;
*/

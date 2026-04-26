import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

interface DriverMarkerProps {
  vehicleClass?: "SEDAN" | "SUV";
}

export default function DriverMarker({
  vehicleClass = "SEDAN",
}: DriverMarkerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.pin}>
        <Ionicons
          name={vehicleClass === "SUV" ? "car-sport" : "car"}
          size={16}
          color="#fff"
        />
      </View>
      <View style={styles.shadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 50,
    alignItems: "center",
  },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  shadow: {
    width: 8,
    height: 4,
    borderRadius: 4,
    backgroundColor: "rgba(0,0,0,0.15)",
    marginTop: 2,
  },
});

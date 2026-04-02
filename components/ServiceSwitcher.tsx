import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolateColor,
} from "react-native-reanimated";
import { useEffect } from "react";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

export type ServiceMode = "ride" | "intercity" | "logistics";

interface ServiceSwitcherProps {
  active: ServiceMode;
  onChange: (mode: ServiceMode) => void;
}

const SERVICES: { id: ServiceMode; label: string; icon: string }[] = [
  { id: "ride", label: "Ride", icon: "car-outline" },
  { id: "intercity", label: "Intercity", icon: "bus-outline" },
  { id: "logistics", label: "Logistics", icon: "cube-outline" },
];

export default function ServiceSwitcher({
  active,
  onChange,
}: ServiceSwitcherProps) {
  return (
    <View style={styles.container}>
      {SERVICES.map((service) => {
        const isActive = active === service.id;
        return (
          <TouchableOpacity
            key={service.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onChange(service.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={service.icon as any}
              size={18}
              color={isActive ? COLORS.primary : "#999"}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {service.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  activeTab: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#999",
  },
  activeLabel: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});

import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

interface Ride {
  id: number;
  name: string;
  price: string;
  eta?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface RideCardProps {
  ride: Ride;
  selected: boolean;
  onPress: () => void;
}

export default function RideCard({ ride, selected, onPress }: RideCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.selected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.iconBox}>
        <Ionicons
          name={ride.icon ?? "car"}
          size={26}
          color={selected ? COLORS.primary : COLORS.subtext}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{ride.name}</Text>
        {ride.eta && <Text style={styles.eta}>{ride.eta}</Text>}
      </View>

      <Text style={[styles.price, selected && { color: COLORS.primary }]}>
        {ride.price}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: "#fff",
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  selected: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFF5F6",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  eta: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.subtext,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "../../components/Button";
import RideCard from "../../components/RideCard";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { useRideStore } from "../../store/useRideStore";

const RIDES = [
  {
    id: 1,
    name: "Bolt",
    price: "₦1,500",
    eta: "3 min away",
    icon: "car-outline" as const,
  },
  {
    id: 2,
    name: "Comfort",
    price: "₦2,500",
    eta: "5 min away",
    icon: "car-sport-outline" as const,
  },
  {
    id: 3,
    name: "XL",
    price: "₦3,500",
    eta: "8 min away",
    icon: "bus-outline" as const,
  },
];

export default function RideOptions() {
  const [selected, setSelected] = useState<number | null>(1);
  const { setRide } = useRideStore();

  const handleConfirm = () => {
    const ride = RIDES.find((r) => r.id === selected);
    if (ride) {
      setRide(ride);
      router.push("/(user)/trip/active");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#111" />
      </TouchableOpacity>

      <Text style={styles.header}>Choose a Ride</Text>

      <View style={styles.routeCard}>
        <View style={styles.routeRow}>
          <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.routeText}>Current Location</Text>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeRow}>
          <View style={[styles.dot, { backgroundColor: "#111" }]} />
          <Text style={styles.routeText}>Destination</Text>
        </View>
      </View>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: SPACING.sm }}
      >
        {RIDES.map((ride) => (
          <RideCard
            key={ride.id}
            ride={ride}
            selected={selected === ride.id}
            onPress={() => setSelected(ride.id)}
          />
        ))}
      </ScrollView>

      {/* Payment row */}
      <View style={styles.payRow}>
        <Ionicons name="card-outline" size={20} color="#555" />
        <Text style={styles.payText}>Pay with Cash</Text>
        <Ionicons name="chevron-forward" size={16} color="#999" />
      </View>

      <Button
        title={`Confirm Ride · ${RIDES.find((r) => r.id === selected)?.price ?? ""}`}
        onPress={handleConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  backBtn: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: SPACING.md,
  },
  routeCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  routeRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  dot: { width: 10, height: 10, borderRadius: 5 },
  routeLine: {
    width: 2,
    height: 14,
    backgroundColor: "#DDD",
    marginLeft: 4,
    marginVertical: 3,
  },
  routeText: { fontSize: 14, color: "#333" },
  list: { flex: 1 },
  payRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: SPACING.md,
  },
  payText: { flex: 1, fontSize: 14, color: "#444" },
});

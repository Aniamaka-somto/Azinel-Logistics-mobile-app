import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import { useLogisticsStore } from "../../../store/useLogisticsStore";
import Input from "../../../components/Input";

const QUICK_LOCATIONS = [
  { label: "Current Location", icon: "locate-outline" },
  { label: "Saved Home", icon: "home-outline" },
  { label: "Saved Work", icon: "briefcase-outline" },
];

export default function LogisticsIndex() {
  const { pickup, delivery, setPickup, setDelivery } = useLogisticsStore();

  const canProceed =
    pickup.address.trim().length > 2 && delivery.address.trim().length > 2;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Send a Package</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Route card */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.routeCard}
        >
          <View style={styles.inputRow}>
            <View style={styles.dotCol}>
              <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
              <View style={styles.dotLine} />
              <View style={[styles.dot, { backgroundColor: "#111" }]} />
            </View>

            <View style={styles.inputs}>
              <View>
                <Text style={styles.inputLabel}>Pickup Address</Text>
                <Input
                  placeholder="Enter pickup address"
                  value={pickup.address}
                  onChangeText={(text) =>
                    setPickup({ ...pickup, address: text })
                  }
                />
              </View>

              <View style={{ height: SPACING.md }} />

              <View>
                <Text style={styles.inputLabel}>Delivery Address</Text>
                <Input
                  placeholder="Enter delivery address"
                  value={delivery.address}
                  onChangeText={(text) =>
                    setDelivery({ ...delivery, address: text })
                  }
                />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick select */}
        <Text style={styles.sectionLabel}>Quick Select for Pickup</Text>
        <View style={styles.quickRow}>
          {QUICK_LOCATIONS.map((loc, i) => (
            <Animated.View
              key={loc.label}
              entering={FadeInDown.delay(i * 80).duration(400)}
              style={styles.quickItem}
            >
              <TouchableOpacity
                style={styles.quickChip}
                onPress={() =>
                  setPickup({
                    ...pickup,
                    address: loc.label,
                    coordinates: null,
                  })
                }
              >
                <Ionicons
                  name={loc.icon as any}
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.quickText}>{loc.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Info banner */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.infoBanner}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={COLORS.primary}
          />
          <Text style={styles.infoText}>
            Our rider will pick up your package and deliver it safely.
            You&apos;ll get real-time tracking once confirmed.
          </Text>
        </Animated.View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.proceedBtn, !canProceed && styles.proceedDisabled]}
        onPress={() => router.push("/(user)/logistics/item-details")}
        disabled={!canProceed}
      >
        <Text style={styles.proceedText}>Add Item Details →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "800", color: "#111" },
  scroll: { padding: SPACING.lg, paddingBottom: 100 },

  routeCard: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  inputRow: { flexDirection: "row", gap: SPACING.sm },
  dotCol: { alignItems: "center", paddingTop: 38, gap: 0 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotLine: { width: 2, height: 52, backgroundColor: "#DDD", marginVertical: 4 },
  inputs: { flex: 1 },
  inputLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  quickRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.lg },
  quickItem: { flex: 1 },
  quickChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "#FFD6DA",
    backgroundColor: "#FFF5F6",
  },
  quickText: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: "600",
    flexShrink: 1,
  },

  infoBanner: {
    flexDirection: "row",
    gap: SPACING.sm,
    backgroundColor: "#FFF5F6",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#FFD6DA",
    padding: SPACING.md,
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 13, color: "#555", lineHeight: 20 },

  proceedBtn: {
    backgroundColor: COLORS.primary,
    margin: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  proceedDisabled: { opacity: 0.45 },
  proceedText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

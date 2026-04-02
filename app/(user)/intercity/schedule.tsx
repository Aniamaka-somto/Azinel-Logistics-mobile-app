import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import {
  useIntercityStore,
  VehicleClass,
} from "../../../store/useIntercityStore";
import { getIntercityPriceEstimate } from "../../../services/api";

const TIMES = [
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
  "08:00 PM",
];

const CLASSES: {
  id: VehicleClass;
  label: string;
  desc: string;
  seats: number;
  icon: string;
}[] = [
  {
    id: "sedan",
    label: "Sedan",
    desc: "Comfortable & affordable",
    seats: 3,
    icon: "car-outline",
  },
  {
    id: "suv",
    label: "SUV",
    desc: "Spacious with extra luggage room",
    seats: 6,
    icon: "car-sport-outline",
  },
];

// Generate next 7 days
const getDates = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      label:
        i === 0
          ? "Today"
          : i === 1
            ? "Tomorrow"
            : d.toLocaleDateString("en-NG", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
      value: d.toISOString().split("T")[0],
    });
  }
  return dates;
};

export default function IntercitySchedule() {
  const {
    originCity,
    destinationCity,
    vehicleClass,
    departureDate,
    departureTime,
    setDepartureDate,
    setDepartureTime,
    setVehicleClass,
    setEstimatedPrice,
  } = useIntercityStore();

  const [loading, setLoading] = useState(false);
  const dates = getDates();
  const canProceed = departureDate && departureTime && vehicleClass;

  const handleProceed = async () => {
    if (!canProceed || !originCity || !destinationCity) return;
    setLoading(true);
    try {
      const { price } = await getIntercityPriceEstimate({
        originCity,
        destinationCity,
        vehicleClass: vehicleClass!,
      });
      setEstimatedPrice(price);
      router.push("/(user)/intercity/confirm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Schedule</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Date */}
        <Text style={styles.sectionLabel}>Departure Date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
        >
          {dates.map((date, i) => {
            const isActive = departureDate === date.value;
            return (
              <Animated.View
                key={date.value}
                entering={FadeInDown.delay(i * 50)}
              >
                <TouchableOpacity
                  style={[styles.dateChip, isActive && styles.dateChipActive]}
                  onPress={() => setDepartureDate(date.value)}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      isActive && styles.dateChipTextActive,
                    ]}
                  >
                    {date.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Time */}
        <Text style={styles.sectionLabel}>Departure Time</Text>
        <View style={styles.timeGrid}>
          {TIMES.map((time, i) => {
            const isActive = departureTime === time;
            return (
              <Animated.View
                key={time}
                entering={FadeInDown.delay(i * 40)}
                style={styles.timeItem}
              >
                <TouchableOpacity
                  style={[styles.timeChip, isActive && styles.timeChipActive]}
                  onPress={() => setDepartureTime(time)}
                >
                  <Text
                    style={[
                      styles.timeChipText,
                      isActive && styles.timeChipTextActive,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Vehicle class */}
        <Text style={styles.sectionLabel}>Vehicle Class</Text>
        {CLASSES.map((cls, i) => {
          const isActive = vehicleClass === cls.id;
          return (
            <Animated.View key={cls.id} entering={FadeInDown.delay(i * 80)}>
              <TouchableOpacity
                style={[styles.classCard, isActive && styles.classCardActive]}
                onPress={() => setVehicleClass(cls.id)}
                activeOpacity={0.85}
              >
                <View
                  style={[styles.classIcon, isActive && styles.classIconActive]}
                >
                  <Ionicons
                    name={cls.icon as any}
                    size={26}
                    color={isActive ? COLORS.primary : "#999"}
                  />
                </View>
                <View style={styles.classInfo}>
                  <Text
                    style={[
                      styles.className,
                      isActive && { color: COLORS.primary },
                    ]}
                  >
                    {cls.label}
                  </Text>
                  <Text style={styles.classDesc}>{cls.desc}</Text>
                  <View style={styles.seatsRow}>
                    <Ionicons name="people-outline" size={13} color="#999" />
                    <Text style={styles.seatsText}>
                      Up to {cls.seats} passengers
                    </Text>
                  </View>
                </View>
                {isActive && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[styles.proceedBtn, !canProceed && styles.proceedDisabled]}
        onPress={handleProceed}
        disabled={!canProceed || loading}
      >
        <Text style={styles.proceedText}>
          {loading ? "Getting price..." : "See Summary →"}
        </Text>
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
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: 100 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },
  hScroll: { marginBottom: SPACING.sm },
  dateChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
    marginRight: SPACING.sm,
  },
  dateChipActive: { borderColor: COLORS.primary, backgroundColor: "#FFF5F6" },
  dateChipText: { fontSize: 13, fontWeight: "500", color: "#555" },
  dateChipTextActive: { color: COLORS.primary, fontWeight: "700" },

  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  timeItem: { width: "30%" },
  timeChip: {
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
    alignItems: "center",
  },
  timeChipActive: { borderColor: COLORS.primary, backgroundColor: "#FFF5F6" },
  timeChipText: { fontSize: 13, fontWeight: "500", color: "#555" },
  timeChipTextActive: { color: COLORS.primary, fontWeight: "700" },

  classCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  classCardActive: { borderColor: COLORS.primary, backgroundColor: "#FFF5F6" },
  classIcon: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.sm,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  classIconActive: { backgroundColor: "#FFE8EA" },
  classInfo: { flex: 1 },
  className: { fontSize: 16, fontWeight: "700", color: "#111" },
  classDesc: { fontSize: 13, color: "#666", marginTop: 2 },
  seatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  seatsText: { fontSize: 12, color: "#999" },

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

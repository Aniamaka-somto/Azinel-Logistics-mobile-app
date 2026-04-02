import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import { useIntercityStore } from "../../../store/useIntercityStore";
import { confirmIntercityBooking } from "../../../services/api";

export default function IntercityConfirm() {
  const store = useIntercityStore();
  const [loading, setLoading] = useState(false);

  const rows = [
    {
      label: "From",
      value: `${store.originArea?.name}, ${store.originCity}`,
      icon: "location",
    },
    {
      label: "To",
      value: `${store.destinationArea?.name}, ${store.destinationCity}`,
      icon: "location-outline",
    },
    {
      label: "Date",
      value: store.departureDate ?? "-",
      icon: "calendar-outline",
    },
    { label: "Time", value: store.departureTime ?? "-", icon: "time-outline" },
    {
      label: "Class",
      value: store.vehicleClass === "suv" ? "SUV" : "Sedan",
      icon: "car-outline",
    },
    {
      label: "Passengers",
      value: `${store.passengers}`,
      icon: "people-outline",
    },
  ];

  const handleConfirm = async () => {
    if (
      !store.originCity ||
      !store.destinationCity ||
      !store.originArea ||
      !store.destinationArea ||
      !store.departureDate ||
      !store.departureTime ||
      !store.vehicleClass
    )
      return;

    setLoading(true);
    try {
      const res = await confirmIntercityBooking({
        originCity: store.originCity,
        destinationCity: store.destinationCity,
        originArea: {
          name: store.originArea.name,
          latitude: store.originArea.coordinates.latitude,
          longitude: store.originArea.coordinates.longitude,
        },
        destinationArea: {
          name: store.destinationArea.name,
          latitude: store.destinationArea.coordinates.latitude,
          longitude: store.destinationArea.coordinates.longitude,
        },
        departureDate: store.departureDate,
        departureTime: store.departureTime,
        vehicleClass: store.vehicleClass,
        passengers: store.passengers,
      });

      store.reset();
      router.replace({
        pathname: "/(user)/booking-success",
        params: { bookingId: res.bookingId, type: "intercity" },
      });
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
        <Text style={styles.title}>Confirm Booking</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.card}>
          {rows.map((row, i) => (
            <View
              key={row.label}
              style={[styles.row, i < rows.length - 1 && styles.rowBorder]}
            >
              <View style={styles.rowIcon}>
                <Ionicons
                  name={row.icon as any}
                  size={16}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Price */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.priceCard}
        >
          <Text style={styles.priceLabel}>Estimated Price</Text>
          <Text style={styles.price}>
            ₦{store.estimatedPrice?.toLocaleString() ?? "—"}
          </Text>
          <Text style={styles.priceSub}>Final price confirmed at booking</Text>
        </Animated.View>

        {/* Payment */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.payCard}
        >
          <Ionicons name="card-outline" size={20} color="#555" />
          <Text style={styles.payText}>Pay with Cash on pickup</Text>
          <Ionicons name="chevron-forward" size={16} color="#CCC" />
        </Animated.View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
        onPress={handleConfirm}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmText}>Confirm Booking</Text>
        )}
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
  scroll: { padding: SPACING.lg, gap: SPACING.md },

  card: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    gap: SPACING.sm,
    backgroundColor: "#fff",
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  rowIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
  },
  rowLabel: { flex: 1, fontSize: 14, color: "#666" },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#111" },

  priceCard: {
    backgroundColor: "#FFF5F6",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#FFD6DA",
    padding: SPACING.lg,
    alignItems: "center",
  },
  priceLabel: { fontSize: 13, color: "#999", marginBottom: 4 },
  price: { fontSize: 32, fontWeight: "800", color: COLORS.primary },
  priceSub: { fontSize: 12, color: "#AAA", marginTop: 4 },

  payCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  payText: { flex: 1, fontSize: 14, color: "#444" },

  confirmBtn: {
    backgroundColor: COLORS.primary,
    margin: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

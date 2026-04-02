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
import { useState, useEffect } from "react";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import { useLogisticsStore } from "../../../store/useLogisticsStore";
import {
  confirmLogisticsBooking,
  getLogisticsPriceEstimate,
} from "../../../services/api";

const CATEGORY_LABELS: Record<string, string> = {
  document: "Document",
  small_parcel: "Small Parcel",
  large_parcel: "Large Parcel",
  fragile: "Fragile Item",
  electronics: "Electronics",
};

export default function LogisticsConfirm() {
  const store = useLogisticsStore();
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(true);

  // Fetch price estimate on mount
  useEffect(() => {
    (async () => {
      if (
        !store.pickup.coordinates ||
        !store.delivery.coordinates ||
        !store.item.category
      ) {
        setEstimating(false);
        return;
      }
      try {
        const { price } = await getLogisticsPriceEstimate({
          pickup: {
            address: store.pickup.address,
            latitude: store.pickup.coordinates?.latitude ?? 0,
            longitude: store.pickup.coordinates?.longitude ?? 0,
          },
          delivery: {
            address: store.delivery.address,
            latitude: store.delivery.coordinates?.latitude ?? 0,
            longitude: store.delivery.coordinates?.longitude ?? 0,
          },
          item: {
            category: store.item.category!,
            weight: store.item.weight ?? 1,
            description: store.item.description,
          },
        });
        store.setEstimatedPrice(price);
      } finally {
        setEstimating(false);
      }
    })();
  }, []);

  const handleConfirm = async () => {
    if (!store.item.category || !store.item.weight) return;
    setLoading(true);
    try {
      const res = await confirmLogisticsBooking({
        pickup: {
          address: store.pickup.address,
          latitude: store.pickup.coordinates?.latitude ?? 0,
          longitude: store.pickup.coordinates?.longitude ?? 0,
        },
        delivery: {
          address: store.delivery.address,
          latitude: store.delivery.coordinates?.latitude ?? 0,
          longitude: store.delivery.coordinates?.longitude ?? 0,
        },
        item: {
          category: store.item.category,
          weight: store.item.weight,
          description: store.item.description,
        },
        receiver: store.receiver,
      });

      store.reset();
      router.replace({
        pathname: "/(user)/booking-success",
        params: { bookingId: res.bookingId, type: "logistics" },
      });
    } finally {
      setLoading(false);
    }
  };

  const summaryRows = [
    { label: "Pickup", value: store.pickup.address, icon: "location" },
    {
      label: "Delivery",
      value: store.delivery.address,
      icon: "location-outline",
    },
    {
      label: "Item Type",
      value: CATEGORY_LABELS[store.item.category ?? ""] ?? "—",
      icon: "cube-outline",
    },
    {
      label: "Weight",
      value: `${store.item.weight ?? "—"} kg`,
      icon: "scale-outline",
    },
    { label: "Receiver", value: store.receiver.name, icon: "person-outline" },
    { label: "Phone", value: store.receiver.phone, icon: "call-outline" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Confirm Delivery</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Summary card */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.card}>
          {summaryRows.map((row, i) => (
            <View
              key={row.label}
              style={[
                styles.row,
                i < summaryRows.length - 1 && styles.rowBorder,
              ]}
            >
              <View style={styles.rowIcon}>
                <Ionicons
                  name={row.icon as any}
                  size={15}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <Text style={styles.rowValue} numberOfLines={1}>
                {row.value}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Item description */}
        {store.item.description ? (
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.descCard}
          >
            <Text style={styles.descLabel}>Item Description</Text>
            <Text style={styles.descText}>{store.item.description}</Text>
          </Animated.View>
        ) : null}

        {/* Price */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.priceCard}
        >
          <Text style={styles.priceLabel}>Estimated Price</Text>
          {estimating ? (
            <ActivityIndicator color={COLORS.primary} size="large" />
          ) : (
            <Text style={styles.price}>
              ₦{store.estimatedPrice?.toLocaleString() ?? "—"}
            </Text>
          )}
          <Text style={styles.priceSub}>Based on weight + distance</Text>
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
        style={[styles.confirmBtn, (loading || estimating) && { opacity: 0.7 }]}
        onPress={handleConfirm}
        disabled={loading || estimating}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmText}>Confirm Delivery</Text>
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
  scroll: { padding: SPACING.lg, gap: SPACING.md, paddingBottom: 100 },

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
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
  },
  rowLabel: { fontSize: 13, color: "#888", width: 70 },
  rowValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    textAlign: "right",
  },

  descCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
  },
  descLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  descText: { fontSize: 14, color: "#333", lineHeight: 20 },

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

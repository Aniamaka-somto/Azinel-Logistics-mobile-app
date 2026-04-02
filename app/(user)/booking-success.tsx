import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

import { COLORS, SPACING, RADIUS } from "../../constants/theme";

const CONFIG = {
  intercity: {
    icon: "bus",
    title: "Ride Booked!",
    message:
      "Your intercity ride has been confirmed. You'll receive a driver assignment before departure.",
    color: COLORS.primary,
  },
  logistics: {
    icon: "cube",
    title: "Delivery Booked!",
    message:
      "Your package pickup has been scheduled. Our rider will contact you and the receiver shortly.",
    color: COLORS.primary,
  },
  ride: {
    icon: "car",
    title: "Ride Confirmed!",
    message: "Your driver is on the way. You can track them on the map.",
    color: COLORS.primary,
  },
};

export default function BookingSuccess() {
  const { bookingId, type } = useLocalSearchParams<{
    bookingId: string;
    type: "intercity" | "logistics" | "ride";
  }>();

  const config = CONFIG[type ?? "ride"];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <Animated.View
          entering={ZoomIn.delay(100).duration(500)}
          style={styles.iconWrap}
        >
          <Ionicons
            name={config.icon as any}
            size={48}
            color={COLORS.primary}
          />
        </Animated.View>

        {/* Text */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.textWrap}
        >
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.message}>{config.message}</Text>
        </Animated.View>

        {/* Booking ID */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(400)}
          style={styles.idCard}
        >
          <Text style={styles.idLabel}>Booking Reference</Text>
          <Text style={styles.idValue}>{bookingId}</Text>
        </Animated.View>

        {/* Steps */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(400)}
          style={styles.steps}
        >
          {[
            "Booking confirmed",
            "Driver assigned",
            "In transit",
            "Delivered",
          ].map((step, i) => (
            <View key={step} style={styles.stepRow}>
              <View style={[styles.stepDot, i === 0 && styles.stepDotActive]} />
              <Text style={[styles.stepText, i === 0 && styles.stepTextActive]}>
                {step}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>

      {/* Actions */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(400)}
        style={styles.actions}
      >
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace("/(user)/(tabs)")}
        >
          <Ionicons name="home-outline" size={18} color="#fff" />
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => router.replace("/(user)/(tabs)/rides")}
        >
          <Text style={styles.historyBtnText}>View My Bookings</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.lg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.lg,
  },

  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD6DA",
  },

  textWrap: { alignItems: "center" },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },

  idCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    alignItems: "center",
    width: "100%",
  },
  idLabel: {
    fontSize: 11,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  idValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 4,
  },

  steps: {
    width: "100%",
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  stepRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#DDD",
  },
  stepDotActive: { backgroundColor: COLORS.primary },
  stepText: { fontSize: 14, color: "#BBB" },
  stepTextActive: { color: "#111", fontWeight: "600" },

  actions: { gap: SPACING.sm, paddingBottom: SPACING.md },
  homeBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  homeBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  historyBtn: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    alignItems: "center",
  },
  historyBtnText: { color: "#555", fontWeight: "600", fontSize: 14 },
});

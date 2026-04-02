import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomSheet from "../../../components/BottomSheet";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

export default function DriverHome() {
  const [online, setOnline] = useState(false);
  const [rideRequest, setRideRequest] = useState(true); // mock request appears when online

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 6.335,
          longitude: 5.6037,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      />

      {/* Top bar */}
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        <View style={styles.topRow}>
          <Text style={styles.logo}>⚡ Driver Mode</Text>
          <View style={styles.onlineToggle}>
            <Text
              style={[
                styles.onlineLabel,
                { color: online ? "#22C55E" : "#999" },
              ]}
            >
              {online ? "Online" : "Offline"}
            </Text>
            <Switch
              value={online}
              onValueChange={setOnline}
              trackColor={{ false: "#E0E0E0", true: "#D4F7E0" }}
              thumbColor={online ? "#22C55E" : "#BDBDBD"}
            />
          </View>
        </View>
      </SafeAreaView>

      {/* Ride Request Popup */}
      {online && rideRequest && (
        <View style={styles.requestPopup}>
          <View style={styles.requestHeader}>
            <View style={styles.requestBadge}>
              <Ionicons name="flash" size={14} color="#fff" />
              <Text style={styles.requestBadgeText}>New Ride</Text>
            </View>
            <Text style={styles.requestPrice}>₦1,500</Text>
          </View>

          <View style={styles.requestRoute}>
            <View style={styles.routeRow}>
              <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.routeText}>Ring Road, Benin City</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeRow}>
              <View style={[styles.dot, { backgroundColor: "#111" }]} />
              <Text style={styles.routeText}>University of Benin</Text>
            </View>
          </View>

          <Text style={styles.requestMeta}>5 min away · 12 km trip</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => setRideRequest(false)}
            >
              <Ionicons name="close" size={20} color={COLORS.primary} />
              <Text style={styles.rejectText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => {
                setRideRequest(false);
                router.push("/(driver)/trip/active");
              }}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom status */}
      <BottomSheet height={140}>
        <View style={styles.statsRow}>
          {[
            { label: "Today's Trips", value: "7" },
            { label: "Online Hours", value: "4.5h" },
            { label: "Earnings", value: "₦12,500" },
          ].map((stat) => (
            <View key={stat.label} style={styles.stat}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  logo: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.primary,
  },
  onlineToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  onlineLabel: {
    fontWeight: "600",
    fontSize: 14,
  },

  requestPopup: {
    position: "absolute",
    bottom: 160,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    elevation: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  requestBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  requestBadgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  requestPrice: { fontSize: 20, fontWeight: "800", color: "#111" },

  requestRoute: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  routeRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  routeLine: {
    width: 2,
    height: 12,
    backgroundColor: "#DDD",
    marginLeft: 3,
    marginVertical: 2,
  },
  routeText: { fontSize: 13, color: "#333" },
  requestMeta: {
    fontSize: 13,
    color: "#888",
    marginBottom: SPACING.md,
  },

  actionRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  rejectText: { color: COLORS.primary, fontWeight: "600" },
  acceptBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  acceptText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SPACING.xs,
  },
  stat: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: "#111" },
  statLabel: { fontSize: 11, color: "#999", marginTop: 2 },
});

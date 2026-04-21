import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { cancelBooking } from "../../../services/api";
import { getSocket } from "../../../services/socket";
import { useRideStore } from "../../../store/useRideStore";

export default function ActiveTrip() {
  const { selectedRide, destination, pickup } = useRideStore();

  const [driverLocation, setDriverLocation] = useState({
    latitude: 6.338,
    longitude: 5.62,
  });
  const [statusText, setStatusText] = useState("Driver is on the way");
  const [driverName, setDriverName] = useState("Emmanuel K.");
  const [driverSub, setDriverSub] = useState("Toyota Corolla · KJA-234EG");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const socket = getSocket();

  useEffect(() => {
    // Driver sends live location updates
    socket.on(
      "driver:location",
      (coords: { latitude: number; longitude: number }) => {
        setDriverLocation(coords);
      },
    );

    // Driver has arrived / trip is in progress
    socket.on("ride:accepted", (booking: any) => {
      setBookingId(booking.id ?? booking.bookingId);
      setStatusText("Driver confirmed — on the way!");
      if (booking.driver?.user?.fullName) {
        setDriverName(booking.driver.user.fullName);
      }
      if (booking.driver?.vehicle) {
        const v = booking.driver.vehicle;
        setDriverSub(`${v.make} ${v.model} · ${v.plateNumber}`);
      }
    });

    // Trip is done — navigate to rating
    socket.on("ride:completed", (booking: any) => {
      const id = booking.id ?? booking.bookingId;
      const name = booking.driver?.user?.fullName ?? "";
      router.replace({
        pathname: "/(user)/trip/rating",
        params: { bookingId: id, driverName: name },
      });
    });

    // Driver cancelled
    socket.on("ride:cancelled", () => {
      setStatusText("Ride was cancelled");
      setTimeout(() => router.replace("/(user)/(tabs)"), 2000);
    });

    return () => {
      socket.off("driver:location");
      socket.off("ride:accepted");
      socket.off("ride:completed");
      socket.off("ride:cancelled");
    };
  }, []);

  const handleCancel = async () => {
    try {
      if (bookingId) await cancelBooking(bookingId);
    } catch {
      // fail silently — still navigate away
    } finally {
      router.replace("/(user)/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: driverLocation.latitude,
          longitude: driverLocation.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        showsUserLocation
      >
        <Marker coordinate={driverLocation} title="Driver">
          <View style={styles.driverPin}>
            <Ionicons name="car" size={18} color="#fff" />
          </View>
        </Marker>
        {destination && <Marker coordinate={destination} pinColor="#111" />}
      </MapView>

      <SafeAreaView edges={["bottom"]} style={styles.card}>
        <View style={styles.statusRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{statusText}</Text>
        </View>

        <Text style={styles.eta}>Arrives in ~4 min</Text>

        <View style={styles.divider} />

        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            <Ionicons name="person" size={22} color={COLORS.primary} />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driverName}</Text>
            <Text style={styles.driverSub}>{driverSub}</Text>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="call" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="chatbubble" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {selectedRide && (
          <View style={styles.rideInfoRow}>
            <Ionicons name="car-outline" size={16} color="#666" />
            <Text style={styles.rideInfoText}>
              {selectedRide.name} · {selectedRide.price}
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel Ride</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  driverPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#22C55E",
  },
  statusText: { fontSize: 14, fontWeight: "600", color: "#22C55E" },
  eta: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: SPACING.md,
  },
  divider: { height: 1, backgroundColor: "#EAEAEA", marginBottom: SPACING.md },
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFD6DA",
  },
  driverInfo: { flex: 1 },
  driverName: { fontWeight: "700", fontSize: 16, color: "#111" },
  driverSub: { fontSize: 13, color: "#666", marginTop: 2 },
  driverActions: { flexDirection: "row", gap: SPACING.sm },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD6DA",
  },
  rideInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: SPACING.md,
    backgroundColor: "#FAFAFA",
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  rideInfoText: { fontSize: 13, color: "#555" },
  cancelBtn: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
  },
  cancelText: { color: COLORS.primary, fontWeight: "600", fontSize: 15 },
});

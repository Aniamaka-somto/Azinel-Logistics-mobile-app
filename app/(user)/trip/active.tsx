import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { cancelBooking } from "../../../services/api";
import { getSocket } from "../../../services/socket";
import { useRideStore } from "../../../store/useRideStore";

export default function ActiveTrip() {
  const { selectedRide, destination, pickup, resetRide } = useRideStore();
  const { bookingId: paramBookingId, driverInfo: paramDriverInfo } =
    useLocalSearchParams<{ bookingId: string; driverInfo: string }>();

  const mapRef = useRef<MapView>(null);

  const [driverLocation, setDriverLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [statusText, setStatusText] = useState("Driver is on the way");
  const [driverName, setDriverName] = useState("Your Driver");
  const [driverSub, setDriverSub] = useState("Assigning vehicle...");
  const [bookingId, setBookingId] = useState<string | null>(
    paramBookingId ?? null,
  );

  // Parse driver info passed from ride-options found state
  useEffect(() => {
    if (paramDriverInfo) {
      try {
        const info = JSON.parse(paramDriverInfo);
        if (info?.user?.fullName) setDriverName(info.user.fullName);
        if (info?.vehicle) {
          const v = info.vehicle;
          setDriverSub(`${v.make} ${v.model} · ${v.plateNumber}`);
        }
      } catch {
        // ignore parse errors
      }
    }
  }, [paramDriverInfo]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Driver sends live location updates
    socket.on(
      "driver:location",
      (coords: { latitude: number; longitude: number }) => {
        setDriverLocation(coords);
        mapRef.current?.animateToRegion(
          { ...coords, latitudeDelta: 0.03, longitudeDelta: 0.03 },
          600,
        );
      },
    );

    // Ride accepted — update driver info
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

    // Trip completed
    socket.on("ride:completed", (booking: any) => {
      resetRide();
      const id = booking.id ?? booking.bookingId;
      const name = booking.driver?.user?.fullName ?? driverName;
      router.replace({
        pathname: "/(user)/trip/rating",
        params: { bookingId: id, driverName: name },
      });
    });

    // Driver cancelled
    socket.on("ride:cancelled", () => {
      resetRide();
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

  // Center map on pickup/destination when screen opens
  useEffect(() => {
    if (pickup && destination) {
      const midLat = (pickup.latitude + destination.latitude) / 2;
      const midLng = (pickup.longitude + destination.longitude) / 2;
      const latDelta =
        Math.abs(pickup.latitude - destination.latitude) * 2 + 0.02;
      const lngDelta =
        Math.abs(pickup.longitude - destination.longitude) * 2 + 0.02;

      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: midLat,
            longitude: midLng,
            latitudeDelta: latDelta,
            longitudeDelta: lngDelta,
          },
          800,
        );
      }, 500);
    }
  }, []);

  const handleCancel = async () => {
    try {
      if (bookingId) await cancelBooking(bookingId);
    } catch {
      // fail silently
    } finally {
      resetRide();
      router.replace("/(user)/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {driverLocation && (
          <Marker coordinate={driverLocation} title="Driver">
            <View style={styles.driverPin}>
              <Ionicons name="car" size={18} color="#fff" />
            </View>
          </Marker>
        )}
        {destination && (
          <Marker coordinate={destination} pinColor={COLORS.primary} />
        )}
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
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    borderWidth: 2,
    borderColor: "#fff",
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

import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useEffect, useState, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import { completeBooking, updateDriverLocation } from "../../../services/api";

type TripPhase = "pickup" | "in_transit" | "arrived";

const PHASE_CONFIG = {
  pickup: {
    label: "Head to pickup",
    sublabel: "Passenger is waiting",
    color: COLORS.primary,
    nextLabel: "Arrived at Pickup",
    nextPhase: "in_transit" as TripPhase,
  },
  in_transit: {
    label: "Trip in progress",
    sublabel: "Driving to destination",
    color: "#F59E0B",
    nextLabel: "Complete Trip",
    nextPhase: "arrived" as TripPhase,
  },
  arrived: {
    label: "Trip Complete!",
    sublabel: "You have arrived",
    color: "#22C55E",
    nextLabel: "Go Back to Dashboard",
    nextPhase: "arrived" as TripPhase,
  },
};

export default function DriverActiveTrip() {
  const {
    bookingId,
    passengerName,
    pickupAddress,
    destAddress,
    estimatedPrice,
    rideType,
  } = useLocalSearchParams<{
    bookingId: string;
    passengerName: string;
    pickupAddress: string;
    destAddress: string;
    estimatedPrice: string;
    rideType: string;
  }>();

  const [phase, setPhase] = useState<TripPhase>("pickup");
  const [driverLocation, setDriverLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [completing, setCompleting] = useState(false);
  const mapRef = useRef<MapView>(null);
  const config = PHASE_CONFIG[phase];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setDriverLocation(coords);
        mapRef.current?.animateToRegion(
          { ...coords, latitudeDelta: 0.03, longitudeDelta: 0.03 },
          600,
        );

        // Send location to backend + socket
        if (bookingId) {
          await updateDriverLocation(
            coords.latitude,
            coords.longitude,
            bookingId,
          ).catch(console.warn);
        }

        interval = setInterval(async () => {
          try {
            const newLoc = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            const newCoords = {
              latitude: newLoc.coords.latitude,
              longitude: newLoc.coords.longitude,
            };
            setDriverLocation(newCoords);
            mapRef.current?.animateToRegion(
              { ...newCoords, latitudeDelta: 0.03, longitudeDelta: 0.03 },
              600,
            );
            if (bookingId) {
              await updateDriverLocation(
                newCoords.latitude,
                newCoords.longitude,
                bookingId,
              ).catch(console.warn);
            }
          } catch {
            // skip failed update
          }
        }, 5000);
      } catch (err) {
        console.warn("Location error:", err);
      }
    })();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleNext = async () => {
    if (phase === "arrived") {
      router.replace("/(driver)/(tabs)");
      return;
    }

    if (phase === "in_transit") {
      // Complete the booking
      if (!bookingId) {
        setPhase("arrived");
        return;
      }
      setCompleting(true);
      try {
        await completeBooking(bookingId);
        setPhase("arrived");
      } catch (err: any) {
        Alert.alert("Error", err.message ?? "Could not complete trip.");
      } finally {
        setCompleting(false);
      }
      return;
    }

    setPhase(config.nextPhase);
  };

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} showsUserLocation={false}>
        {driverLocation && (
          <Marker coordinate={driverLocation} title="You">
            <View style={styles.driverPin}>
              <Ionicons name="car" size={18} color="#fff" />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Phase indicator */}
      <View style={styles.phaseBar}>
        {(["pickup", "in_transit", "arrived"] as TripPhase[]).map((p, i) => (
          <View key={p} style={styles.phaseStep}>
            <View
              style={[
                styles.phaseDot,
                (phase === p ||
                  (phase === "in_transit" && i === 0) ||
                  (phase === "arrived" && i <= 1)) &&
                  styles.phaseDotDone,
              ]}
            />
            {i < 2 && (
              <View
                style={[
                  styles.phaseLine,
                  ((phase === "in_transit" && i === 0) ||
                    phase === "arrived") &&
                    styles.phaseLineDone,
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <SafeAreaView edges={["bottom"]} style={styles.card}>
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.statusRow}
        >
          <View style={[styles.statusDot, { backgroundColor: config.color }]} />
          <Text style={[styles.statusLabel, { color: config.color }]}>
            {config.label}
          </Text>
        </Animated.View>

        <Text style={styles.sublabel}>{config.sublabel}</Text>

        <View style={styles.divider} />

        {/* Passenger info — real data from params */}
        <View style={styles.passengerRow}>
          <View style={styles.passengerAvatar}>
            <Ionicons name="person" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>
              {passengerName ?? "Passenger"}
            </Text>
            <Text style={styles.passengerRoute} numberOfLines={1}>
              {pickupAddress ?? "Pickup"} → {destAddress ?? "Destination"}
            </Text>
          </View>
          <View style={styles.passengerActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="call" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="chatbubble" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip meta — real data */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={15} color="#666" />
            <Text style={styles.metaText}>
              ₦
              {estimatedPrice ? parseInt(estimatedPrice).toLocaleString() : "—"}{" "}
              Cash
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="car-outline" size={15} color="#666" />
            <Text style={styles.metaText}>{rideType ?? "Ride"}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.actionMainBtn,
            { backgroundColor: config.color },
            completing && { opacity: 0.7 },
          ]}
          onPress={handleNext}
          disabled={completing}
        >
          <Text style={styles.actionMainText}>
            {completing ? "Completing..." : config.nextLabel}
          </Text>
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
  phaseBar: {
    position: "absolute",
    top: 56,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  phaseStep: { flexDirection: "row", alignItems: "center", flex: 1 },
  phaseDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#DDD" },
  phaseDotDone: { backgroundColor: COLORS.primary },
  phaseLine: { flex: 1, height: 2, backgroundColor: "#DDD" },
  phaseLineDone: { backgroundColor: COLORS.primary },
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
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontWeight: "700", fontSize: 13 },
  sublabel: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: SPACING.md,
  },
  divider: { height: 1, backgroundColor: "#EAEAEA", marginBottom: SPACING.md },
  passengerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  passengerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFD6DA",
  },
  passengerInfo: { flex: 1 },
  passengerName: { fontWeight: "700", fontSize: 15, color: "#111" },
  passengerRoute: { fontSize: 12, color: "#888", marginTop: 2 },
  passengerActions: { flexDirection: "row", gap: SPACING.sm },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD6DA",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, color: "#555" },
  actionMainBtn: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  actionMainText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

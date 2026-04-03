import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useEffect, useState, useRef } from "react";
import { router } from "expo-router";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";

type TripPhase = "pickup" | "in_transit" | "arrived";

const PASSENGER_LOCATION = { latitude: 6.342, longitude: 5.627 };
const DESTINATION = { latitude: 6.374, longitude: 5.633 };

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
  const [phase, setPhase] = useState<TripPhase>("pickup");
  const [driverLocation, setDriverLocation] = useState({
    latitude: 6.335,
    longitude: 5.61,
  });
  const mapRef = useRef<MapView>(null);
  const config = PHASE_CONFIG[phase];

  // Simulate driver moving toward passenger
  useEffect(() => {
    if (phase === "arrived") return;

    const target = phase === "pickup" ? PASSENGER_LOCATION : DESTINATION;
    const interval = setInterval(() => {
      setDriverLocation((prev) => {
        const next = {
          latitude: prev.latitude + (target.latitude - prev.latitude) * 0.1,
          longitude: prev.longitude + (target.longitude - prev.longitude) * 0.1,
        };
        mapRef.current?.animateToRegion(
          { ...next, latitudeDelta: 0.03, longitudeDelta: 0.03 },
          600,
        );
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [phase]);

  const handleNext = () => {
    if (phase === "arrived") {
      router.replace("/(driver)/(tabs)");
      return;
    }
    setPhase(config.nextPhase);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 6.338,
          longitude: 5.62,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Driver */}
        <Marker coordinate={driverLocation} title="You">
          <View style={styles.driverPin}>
            <Ionicons name="car" size={18} color="#fff" />
          </View>
        </Marker>

        {/* Passenger pickup */}
        <Marker
          coordinate={PASSENGER_LOCATION}
          title="Passenger"
          pinColor={COLORS.primary}
        />

        {/* Destination */}
        <Marker coordinate={DESTINATION} title="Destination" pinColor="#111" />

        {/* Route line */}
        <Polyline
          coordinates={[driverLocation, PASSENGER_LOCATION, DESTINATION]}
          strokeColor={COLORS.primary}
          strokeWidth={3}
          lineDashPattern={[6, 4]}
        />
      </MapView>

      {/* Phase indicator bar */}
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

      {/* Bottom trip card */}
      <SafeAreaView edges={["bottom"]} style={styles.card}>
        {/* Status */}
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

        {/* Passenger info */}
        <View style={styles.passengerRow}>
          <View style={styles.passengerAvatar}>
            <Ionicons name="person" size={20} color={COLORS.primary} />
          </View>
          <View style={styles.passengerInfo}>
            <Text style={styles.passengerName}>Amaka Okonkwo</Text>
            <Text style={styles.passengerRoute}>
              Ring Road → University of Benin
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

        {/* Trip meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={15} color="#666" />
            <Text style={styles.metaText}>₦1,500 Cash</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="navigate-outline" size={15} color="#666" />
            <Text style={styles.metaText}>3.2 km</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={15} color="#666" />
            <Text style={styles.metaText}>~8 min</Text>
          </View>
        </View>

        {/* Action button */}
        <TouchableOpacity
          style={[styles.actionMainBtn, { backgroundColor: config.color }]}
          onPress={handleNext}
        >
          <Text style={styles.actionMainText}>{config.nextLabel}</Text>
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
  phaseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#DDD",
  },
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

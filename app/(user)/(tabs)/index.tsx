import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import ServiceSwitcher, {
  ServiceMode,
} from "../../../components/ServiceSwitcher";
import DraggableSheet from "../../../components/DraggableSheet";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { useRideStore } from "../../../store/useRideStore";

const INITIAL_REGION = {
  latitude: 6.335,
  longitude: 5.6037,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function Home() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [serviceMode, setServiceMode] = useState<ServiceMode>("ride");
  const { pickup, destination } = useRideStore();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        region={
          location
            ? {
                ...location,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : undefined
        }
        showsUserLocation
        showsMyLocationButton={false}
      >
        {pickup && <Marker coordinate={pickup} pinColor={COLORS.primary} />}
        {destination && <Marker coordinate={destination} pinColor="#111" />}
      </MapView>

      {/* Top bar */}
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        <View style={styles.topRow}>
          <Text style={styles.logo}>Aziniel</Text>
          <TouchableOpacity style={styles.avatar}>
            <Ionicons name="person" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Floating search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push("/(user)/search")}
          activeOpacity={0.85}
        >
          <Ionicons name="search" size={18} color={COLORS.subtext} />
          <Text style={styles.searchText}>Where to?</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Bottom Sheet */}
      <DraggableSheet>
        <ServiceSwitcher active={serviceMode} onChange={setServiceMode} />

        {serviceMode === "ride" && (
          <TouchableOpacity
            style={styles.bigBtn}
            onPress={() => router.push("/(user)/search")}
          >
            <Ionicons name="navigate" size={18} color="#fff" />
            <Text style={styles.bigBtnText}>Choose Destination</Text>
          </TouchableOpacity>
        )}

        {serviceMode === "intercity" && (
          <TouchableOpacity
            style={styles.bigBtn}
            onPress={() => router.push("/(user)/intercity")}
          >
            <Ionicons name="bus" size={18} color="#fff" />
            <Text style={styles.bigBtnText}>Book Intercity Ride</Text>
          </TouchableOpacity>
        )}

        {serviceMode === "logistics" && (
          <TouchableOpacity
            style={styles.bigBtn}
            onPress={() => router.push("/(user)/logistics")}
          >
            <Ionicons name="cube" size={18} color="#fff" />
            <Text style={styles.bigBtnText}>Send a Package</Text>
          </TouchableOpacity>
        )}
      </DraggableSheet>
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
    marginBottom: SPACING.sm,
  },
  logo: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: "#fff",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  searchText: {
    fontSize: 15,
    color: "#999",
  },

  sectionTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
    marginBottom: SPACING.md,
  },

  quickRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  quickChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: "#FFF5F6",
    borderWidth: 1,
    borderColor: "#FFD6DA",
  },
  chipLabel: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "500",
  },

  bigBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  bigBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});

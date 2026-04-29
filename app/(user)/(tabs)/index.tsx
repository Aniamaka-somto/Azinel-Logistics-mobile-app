import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ServiceSwitcher, {
  ServiceMode,
} from "../../../components/ServiceSwitcher";
import DraggableSheet from "../../../components/DraggableSheet";
import DriverMarker from "../../../components/DriverMarker";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { useRideStore } from "../../../store/useRideStore";
import { BASE_URL } from "../../../services/api";

interface NearbyDriver {
  id: string;
  latitude: number;
  longitude: number;
  vehicleClass: "SEDAN" | "SUV";
  fullName: string;
  rating: number;
}

export default function Home() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [serviceMode, setServiceMode] = useState<ServiceMode>("ride");
  const [nearbyDrivers, setNearbyDrivers] = useState<NearbyDriver[]>([]);
  const mapRef = useRef<MapView>(null);
  const { pickup, destination, setPickup } = useRideStore();

  // Get user location + start polling drivers
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      console.log(
        "PASSENGER LOCATION:",
        loc.coords.latitude,
        loc.coords.longitude,
      );
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };

      setLocation(coords);
      setPickup(coords);

      mapRef.current?.animateToRegion(
        { ...coords, latitudeDelta: 0.04, longitudeDelta: 0.04 },
        800,
      );

      // Fetch nearby drivers immediately then every 10 seconds
      fetchNearbyDrivers(coords.latitude, coords.longitude);
      interval = setInterval(() => {
        fetchNearbyDrivers(coords.latitude, coords.longitude);
      }, 10000);
    })();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const fetchNearbyDrivers = async (lat: number, lng: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        `${BASE_URL}/driver/nearby?lat=${lat}&lng=${lng}&radius=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) return;
      const json = await res.json();
      console.log("NEARBY DRIVERS:", JSON.stringify(json.data));
      setNearbyDrivers(json.data ?? []);
    } catch (err) {
      // Silently fail — don't crash if no drivers found
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
        {/* Passenger's destination marker */}
        {destination && <Marker coordinate={destination} pinColor="#111" />}

        {/* Nearby driver markers */}
        {nearbyDrivers.map((driver) => (
          <Marker
            key={driver.id}
            coordinate={{
              latitude: driver.latitude,
              longitude: driver.longitude,
            }}
            title={driver.fullName}
            description={`⭐ ${driver.rating}`}
            // pinColor is ignored when using a custom child. Remove it.
            tracksViewChanges={true} // Ensures the map properly renders custom React Native views
          >
            <DriverMarker vehicleClass={driver.vehicleClass} />
          </Marker>
        ))}
      </MapView>

      {/* Top bar */}
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        <View style={styles.topRow}>
          <Text style={styles.logo}>Azinel</Text>
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
          <Ionicons name="search" size={18} color="#999" />
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

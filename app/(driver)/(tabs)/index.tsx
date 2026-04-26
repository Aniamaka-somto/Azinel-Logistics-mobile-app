import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated as RNAnimated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BottomSheet from "../../../components/BottomSheet";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import {
  acceptBooking,
  setDriverStatus,
  updateDriverLocation,
  getDriverProfile,
} from "../../../services/api";
import { connectSocket } from "../../../services/socket";

export default function DriverHome() {
  const [online, setOnline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rideRequest, setRideRequest] = useState<any>(null);
  const [countdown, setCountdown] = useState(15);
  const [driverLocation, setDriverLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const mapRef = useRef<MapView>(null);
  const locationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Slide animation for the online button
  const slideAnim = useRef(new RNAnimated.Value(0)).current;
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  // Pulse animation when online
  useEffect(() => {
    if (online) {
      RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 900,
            useNativeDriver: true,
          }),
          RNAnimated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [online]);

  // Location tracking when online
  useEffect(() => {
    if (online) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
    return () => stopLocationTracking();
  }, [online]);

  const startLocationTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location Required", "Please enable location to go online.");
      return;
    }

    // Get initial location
    const loc = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };
    setDriverLocation(coords);
    mapRef.current?.animateToRegion(
      { ...coords, latitudeDelta: 0.04, longitudeDelta: 0.04 },
      800,
    );

    // Send to backend
    await updateDriverLocation(coords.latitude, coords.longitude).catch(
      console.warn,
    );

    // Update every 10 seconds
    locationInterval.current = setInterval(async () => {
      const newLoc = await Location.getCurrentPositionAsync({});
      const newCoords = {
        latitude: newLoc.coords.latitude,
        longitude: newLoc.coords.longitude,
      };
      setDriverLocation(newCoords);
      await updateDriverLocation(newCoords.latitude, newCoords.longitude).catch(
        console.warn,
      );
    }, 10000);
  };

  const stopLocationTracking = () => {
    if (locationInterval.current) {
      clearInterval(locationInterval.current);
      locationInterval.current = null;
    }
  };

  // Socket setup
  useEffect(() => {
    const setupSocket = async () => {
      if (!online) return;
      try {
        const profile = await getDriverProfile();
        const socket = await connectSocket(profile.id, "driver");

        socket.on("booking:request", (booking: any) => {
          setRideRequest(booking);
          setCountdown(15);

          // Start countdown
          if (countdownInterval.current)
            clearInterval(countdownInterval.current);
          countdownInterval.current = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownInterval.current!);
                setRideRequest(null);
                return 15;
              }
              return prev - 1;
            });
          }, 1000);
        });

        socket.on("booking:request_expired", ({ bookingId }: any) => {
          setRideRequest((current: any) =>
            current?.id === bookingId ? null : current,
          );
          if (countdownInterval.current)
            clearInterval(countdownInterval.current);
        });
      } catch (err) {
        console.warn("Socket setup failed:", err);
      }
    };

    setupSocket();

    return () => {
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [online]);

  const handleToggleOnline = async () => {
    setLoading(true);
    try {
      const newStatus = online ? "OFFLINE" : "ONLINE";
      await setDriverStatus(newStatus);
      setOnline(!online);

      // Animate the button
      RNAnimated.spring(slideAnim, {
        toValue: online ? 0 : 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } catch (err: any) {
      Alert.alert(
        "Connection Error",
        "Could not update status. Check your connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!rideRequest) return;
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    try {
      await acceptBooking(rideRequest.id);
      setRideRequest(null);
      router.push("/(driver)/trip/active");
    } catch (err: any) {
      if (err.message?.includes("taken")) {
        Alert.alert("Too slow!", "Another driver accepted this ride first.");
      } else {
        Alert.alert("Error", err.message);
      }
      setRideRequest(null);
    }
  };

  const handleDecline = async () => {
    if (!rideRequest) return;
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    try {
      const token = await AsyncStorage.getItem("token");
      await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/v1/bookings/${rideRequest.id}/decline`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (err) {
      console.warn("Decline failed:", err);
    }
    setRideRequest(null);
  };

  // Interpolate slide button position
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 54],
  });

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 6.335,
          longitude: 5.6037,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
      >
        {/* {driverLocation && (
          <Marker coordinate={driverLocation}>
            <View style={styles.driverPin}>
              <Ionicons name="car" size={16} color="#fff" />
            </View>
          </Marker>
        )} */}
      </MapView>

      {/* Top bar */}
      <SafeAreaView style={styles.topBar} edges={["top"]}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.logo}>⚡ Azinel Driver</Text>
            <Text style={styles.statusLabel}>
              {loading
                ? "Updating..."
                : online
                  ? "You are Online"
                  : "You are Offline"}
            </Text>
          </View>

          {/* Custom slide toggle */}
          <TouchableOpacity
            onPress={handleToggleOnline}
            disabled={loading}
            activeOpacity={0.9}
          >
            <RNAnimated.View
              style={[
                styles.slideTrack,
                {
                  backgroundColor: online ? "#D4F7E0" : "#E0E0E0",
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <RNAnimated.View
                style={[
                  styles.slideThumb,
                  {
                    backgroundColor: online ? "#22C55E" : "#999",
                    transform: [{ translateX }],
                  },
                ]}
              >
                <Ionicons
                  name={online ? "radio" : "radio-outline"}
                  size={14}
                  color="#fff"
                />
              </RNAnimated.View>

              <Text
                style={[
                  styles.slideLabel,
                  online ? styles.slideLabelOnline : styles.slideLabelOffline,
                ]}
              >
                {online ? "ON" : "OFF"}
              </Text>
            </RNAnimated.View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Online status banner */}
      {online && (
        <View style={styles.onlineBanner}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineBannerText}>
            Waiting for ride requests...
          </Text>
        </View>
      )}

      {/* Ride Request Popup */}
      {online && rideRequest && (
        <View style={styles.requestPopup}>
          {/* Countdown bar */}
          <View style={styles.countdownBarWrap}>
            <RNAnimated.View
              style={[
                styles.countdownBar,
                { width: `${(countdown / 15) * 100}%` },
              ]}
            />
          </View>

          <View style={styles.requestHeader}>
            <View style={styles.requestBadge}>
              <Ionicons name="flash" size={14} color="#fff" />
              <Text style={styles.requestBadgeText}>New Ride</Text>
            </View>
            <View style={styles.countdownPill}>
              <Ionicons name="time-outline" size={13} color={COLORS.primary} />
              <Text style={styles.countdownText}>{countdown}s</Text>
            </View>
            <Text style={styles.requestPrice}>
              ₦{rideRequest.estimatedPrice?.toLocaleString()}
            </Text>
          </View>

          <View style={styles.requestRoute}>
            <View style={styles.routeRow}>
              <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.routeText} numberOfLines={1}>
                {rideRequest.pickupAddress ?? "Pickup Location"}
              </Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routeRow}>
              <View style={[styles.dot, { backgroundColor: "#111" }]} />
              <Text style={styles.routeText} numberOfLines={1}>
                {rideRequest.destAddress ?? "Destination"}
              </Text>
            </View>
          </View>

          <View style={styles.requestMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="car-outline" size={14} color="#666" />
              <Text style={styles.metaText}>
                {rideRequest.rideType ?? "Ride"}
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="navigate-outline" size={14} color="#666" />
              <Text style={styles.metaText}>~5 min away</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={14} color="#666" />
              <Text style={styles.metaText}>Cash</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.rejectBtn} onPress={handleDecline}>
              <Ionicons name="close" size={20} color={COLORS.primary} />
              <Text style={styles.rejectText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.acceptText}>Accept Ride</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom stats */}
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

  driverPin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    borderWidth: 2,
    borderColor: "#fff",
  },

  // Top bar
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
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
  },
  statusLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  // Custom slide toggle
  slideTrack: {
    width: 100,
    height: 38,
    borderRadius: 19,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    justifyContent: "space-between",
  },
  slideThumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    position: "absolute",
  },
  slideLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
    position: "absolute",
  },
  slideLabelOnline: {
    right: 10,
    color: "#22C55E",
  },
  slideLabelOffline: {
    left: 10,
    color: "#999",
  },

  // Online banner
  onlineBanner: {
    position: "absolute",
    top: 110,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },
  onlineBannerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  // Ride request popup
  requestPopup: {
    position: "absolute",
    bottom: 160,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    elevation: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  // Countdown bar
  countdownBarWrap: {
    width: "100%",
    height: 4,
    backgroundColor: "#EAEAEA",
  },
  countdownBar: {
    height: 4,
    backgroundColor: COLORS.primary,
  },

  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
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
  countdownPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF5F6",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "#FFD6DA",
  },
  countdownText: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primary,
  },
  requestPrice: { fontSize: 20, fontWeight: "800", color: "#111" },

  requestRoute: {
    backgroundColor: "#FAFAFA",
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  routeRow: { flexDirection: "row", alignItems: "center", gap: SPACING.sm },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  routeLine: {
    width: 2,
    height: 12,
    backgroundColor: "#DDD",
    marginLeft: 3,
    marginVertical: 2,
  },
  routeText: { fontSize: 13, color: "#333", flex: 1 },

  requestMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: "#666" },
  metaDivider: { width: 1, height: 12, backgroundColor: "#EAEAEA" },

  actionRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    padding: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
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

  // Stats
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: SPACING.xs,
  },
  stat: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: "#111" },
  statLabel: { fontSize: 11, color: "#999", marginTop: 2 },
});

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";

import RideCard from "../../components/RideCard";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { useRideStore } from "../../store/useRideStore";
import { confirmRideBooking, getStoredUser } from "../../services/api";
import { connectSocket, getSocket } from "../../services/socket";

const RIDES = [
  {
    id: 1,
    name: "Bolt",
    price: 1500,
    displayPrice: "₦1,500",
    eta: "3 min away",
    icon: "car-outline" as const,
  },
  {
    id: 2,
    name: "Comfort",
    price: 2500,
    displayPrice: "₦2,500",
    eta: "5 min away",
    icon: "car-sport-outline" as const,
  },
  {
    id: 3,
    name: "XL",
    price: 3500,
    displayPrice: "₦3,500",
    eta: "8 min away",
    icon: "bus-outline" as const,
  },
];

type BookingState = "idle" | "searching" | "found" | "timeout";

export default function RideOptions() {
  const [selected, setSelected] = useState<number | null>(1);
  const [bookingState, setBookingState] = useState<BookingState>("idle");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [driverInfo, setDriverInfo] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { pickup, destination, setRide } = useRideStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      getSocket()?.off("ride:accepted");
      getSocket()?.off("booking:no_drivers");
      getSocket()?.off("booking:dispatching");
    };
  }, []);

  const handleConfirm = async () => {
    if (!selected) return;

    const ride = RIDES.find((r) => r.id === selected)!;
    setRide({ id: ride.id, name: ride.name, price: ride.displayPrice });
    setBookingState("searching");
    setElapsed(0);

    try {
      const user = await getStoredUser();
      console.log("USER:", JSON.stringify(user));
      console.log("USER:", JSON.stringify(user));
      if (!user) {
        router.replace("/auth");
        return;
      }
      console.log("PICKUP:", JSON.stringify(pickup)); // ← add
      console.log("DESTINATION:", JSON.stringify(destination));
      // Create booking on backend
      const res = await confirmRideBooking({
        pickup: pickup ?? { latitude: 6.335, longitude: 5.6037 },
        destination: destination ?? { latitude: 6.374, longitude: 5.633 },
        rideType: ride.name,
        price: ride.price,
      });

      setBookingId(res.bookingId);

      // Connect socket and join booking room
      const socket = await connectSocket(user.id, "user");
      socket.emit("booking:join", res.bookingId);

      // Driver accepted
      socket.on("ride:accepted", (data: any) => {
        setDriverInfo(data.driver);
        setBookingState("found");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        socket.off("ride:accepted");
        socket.off("booking:no_drivers");
        socket.off("booking:dispatching");
      });

      // No drivers available
      socket.on("booking:no_drivers", () => {
        setBookingState("timeout");
        if (timerRef.current) clearInterval(timerRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        socket.off("ride:accepted");
        socket.off("booking:no_drivers");
        socket.off("booking:dispatching");
      });

      // Optional — dispatching status updates
      socket.on("booking:dispatching", (data: any) => {
        console.log("Dispatching:", data.message);
      });

      // Start elapsed timer
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);

      // Hard timeout after 90 seconds as fallback
      timeoutRef.current = setTimeout(() => {
        setBookingState("timeout");
        if (timerRef.current) clearInterval(timerRef.current);
        socket.off("ride:accepted");
        socket.off("booking:no_drivers");
        socket.off("booking:dispatching");
      }, 90000);
    } catch (err: any) {
      setBookingState("idle");
      Alert.alert(
        "Error",
        err.message ?? "Could not create booking. Please try again.",
      );
    }
  };

  const handleCancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    const socket = getSocket();
    socket?.off("ride:accepted");
    socket?.off("booking:no_drivers");
    socket?.off("booking:dispatching");
    setBookingState("idle");
    setBookingId(null);
    setElapsed(0);
  }, []);

  const handleGoToTrip = () => {
    router.replace({
      pathname: "/(user)/trip/active",
      params: {
        bookingId: bookingId!,
        driverInfo: JSON.stringify(driverInfo),
      },
    });
  };

  // ── SEARCHING ────────────────────────────────────────────────
  if (bookingState === "searching") {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.stateCard}
        >
          {/* Pulse indicator */}
          <View style={styles.pulseOuter}>
            <View style={styles.pulseInner}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          </View>

          <Text style={styles.stateTitle}>Finding your driver...</Text>
          <Text style={styles.stateSub}>
            Looking for nearby drivers. This usually takes under a minute.
          </Text>

          {/* Timer */}
          <View style={styles.timerRow}>
            <Ionicons name="time-outline" size={15} color="#999" />
            <Text style={styles.timerText}>{elapsed}s</Text>
          </View>

          {/* Ride summary */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.summaryText} numberOfLines={1}>
                Current Location
              </Text>
            </View>
            <View style={styles.summaryLine} />
            <View style={styles.summaryRow}>
              <View style={[styles.dot, { backgroundColor: "#111" }]} />
              <Text style={styles.summaryText} numberOfLines={1}>
                Destination
              </Text>
            </View>
          </View>

          {/* Selected ride */}
          <View style={styles.rideTagRow}>
            <Ionicons
              name={RIDES.find((r) => r.id === selected)?.icon ?? "car-outline"}
              size={16}
              color={COLORS.primary}
            />
            <Text style={styles.rideTagText}>
              {RIDES.find((r) => r.id === selected)?.name} ·{" "}
              {RIDES.find((r) => r.id === selected)?.displayPrice}
            </Text>
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelBtnText}>Cancel Search</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── DRIVER FOUND ─────────────────────────────────────────────
  if (bookingState === "found" && driverInfo) {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.stateCard}
        >
          {/* Success icon */}
          <View style={styles.foundIconWrap}>
            <Ionicons name="checkmark-circle" size={56} color="#22C55E" />
          </View>

          <Text style={styles.stateTitle}>Driver Found!</Text>
          <Text style={styles.stateSub}>
            Your driver is on the way to pick you up.
          </Text>

          {/* Driver card */}
          <View style={styles.driverCard}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={26} color={COLORS.primary} />
            </View>

            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>
                {driverInfo?.user?.fullName ?? "Your Driver"}
              </Text>
              <Text style={styles.driverSub}>
                {driverInfo?.vehicle
                  ? `${driverInfo.vehicle.make} ${driverInfo.vehicle.model} · ${driverInfo.vehicle.plateNumber}`
                  : "Vehicle info loading..."}
              </Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color="#FFB800" />
                <Text style={styles.ratingText}>
                  {driverInfo?.rating ?? "5.0"}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* ETA */}
          <View style={styles.etaRow}>
            <Ionicons name="navigate-outline" size={15} color="#666" />
            <Text style={styles.etaText}>Arriving in approximately 4 mins</Text>
          </View>

          <TouchableOpacity style={styles.trackBtn} onPress={handleGoToTrip}>
            <Ionicons name="map-outline" size={18} color="#fff" />
            <Text style={styles.trackBtnText}>Track Driver</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── TIMEOUT / NO DRIVERS ─────────────────────────────────────
  if (bookingState === "timeout") {
    return (
      <SafeAreaView style={styles.stateContainer}>
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.stateCard}
        >
          <View style={styles.timeoutIconWrap}>
            <Ionicons name="alert-circle" size={56} color="#F59E0B" />
          </View>

          <Text style={styles.stateTitle}>No drivers found</Text>
          <Text style={styles.stateSub}>
            No driver accepted your request. This usually means drivers are busy
            in your area. Please try again in a moment.
          </Text>

          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => {
              setBookingState("idle");
              setElapsed(0);
            }}
          >
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.goHomeBtn}
            onPress={() => router.replace("/(user)/(tabs)")}
          >
            <Text style={styles.goHomeBtnText}>Go Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ── IDLE (default ride selection) ────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#111" />
      </TouchableOpacity>

      <Text style={styles.header}>Choose a Ride</Text>

      {/* Route summary */}
      <View style={styles.routeCard}>
        <View style={styles.routeRow}>
          <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>From</Text>
            <Text style={styles.routeText}>Current Location</Text>
          </View>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.routeRow}>
          <View style={[styles.dot, { backgroundColor: "#111" }]} />
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>To</Text>
            <Text style={styles.routeText}>
              {destination ? "Selected destination" : "Destination"}
            </Text>
          </View>
        </View>
      </View>

      {/* Ride options */}
      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: SPACING.sm }}
      >
        {RIDES.map((ride, index) => (
          <Animated.View
            key={ride.id}
            entering={FadeInDown.delay(index * 100).duration(400)}
          >
            <RideCard
              ride={{ ...ride, price: ride.displayPrice }}
              selected={selected === ride.id}
              onPress={() => setSelected(ride.id)}
            />
          </Animated.View>
        ))}
      </ScrollView>

      {/* Payment method */}
      <View style={styles.payRow}>
        <Ionicons name="card-outline" size={20} color="#555" />
        <Text style={styles.payText}>Pay with Cash</Text>
        <Ionicons name="chevron-forward" size={16} color="#999" />
      </View>

      {/* Confirm button */}
      <TouchableOpacity
        style={[styles.confirmBtn, !selected && styles.confirmDisabled]}
        onPress={handleConfirm}
        disabled={!selected}
      >
        <Text style={styles.confirmText}>
          {selected
            ? `Confirm · ${RIDES.find((r) => r.id === selected)?.displayPrice}`
            : "Select a Ride"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Main layout ──────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  backBtn: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: SPACING.md,
  },
  routeCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  routeInfo: { flex: 1 },
  routeLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  routeText: { fontSize: 14, color: "#333", fontWeight: "500", marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  routeLine: {
    width: 2,
    height: 18,
    backgroundColor: "#DDD",
    marginLeft: 4,
    marginVertical: 4,
  },
  list: { flex: 1 },
  payRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: SPACING.md,
    marginTop: SPACING.sm,
  },
  payText: { flex: 1, fontSize: 14, color: "#444" },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  confirmDisabled: { backgroundColor: "#DDD" },
  confirmText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // ── State screens (searching / found / timeout) ──────────────
  stateContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: SPACING.lg,
  },
  stateCard: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.xl,
    alignItems: "center",
    gap: SPACING.md,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    textAlign: "center",
  },
  stateSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },

  // Searching
  pulseOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD6DA",
  },
  pulseInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  timerText: { fontSize: 13, color: "#666", fontWeight: "600" },
  summaryCard: {
    width: "100%",
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  summaryLine: {
    width: 2,
    height: 14,
    backgroundColor: "#DDD",
    marginLeft: 4,
    marginVertical: 4,
  },
  summaryText: { flex: 1, fontSize: 13, color: "#555" },
  rideTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF5F6",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "#FFD6DA",
  },
  rideTagText: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },
  cancelBtn: {
    width: "100%",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: "center",
  },
  cancelBtnText: { color: COLORS.primary, fontWeight: "700", fontSize: 15 },

  // Found
  foundIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#BBF7D0",
  },
  driverCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFD6DA",
  },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 15, fontWeight: "700", color: "#111" },
  driverSub: { fontSize: 12, color: "#888", marginTop: 2 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: { fontSize: 12, fontWeight: "600", color: "#555" },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD6DA",
  },
  etaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  etaText: { fontSize: 13, color: "#555" },
  trackBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  trackBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // Timeout
  timeoutIconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFFBEB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FDE68A",
  },
  retryBtn: {
    width: "100%",
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  retryBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  goHomeBtn: {
    width: "100%",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    alignItems: "center",
  },
  goHomeBtnText: { color: "#666", fontWeight: "600", fontSize: 14 },
});

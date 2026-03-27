import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LiveTrackingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerBadge}>
          <View style={styles.liveDot} />
          <Text style={styles.headerText}>LIVE TRACKING</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={80} color="#2A2A2A" />
        </View>

        {/* Arriving Badge */}
        <View style={styles.arrivingBadge}>
          <Ionicons name="time" size={20} color="#fff" />
          <Text style={styles.arrivingText}>Arriving in</Text>
          <Text style={styles.arrivingTime}>6h 20m</Text>
        </View>

        {/* Car Icon */}
        <View style={styles.carMarker}>
          <Ionicons name="car" size={24} color="#000" />
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />

        {/* Trip Info */}
        <View style={styles.tripInfo}>
          <Text style={styles.activeTripLabel}>ACTIVE TRIP</Text>
          <View style={styles.routeRow}>
            <View>
              <Text style={styles.routeFrom}>PHC</Text>
              <Text style={styles.routeTo}>Abuja</Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="#E53935" />
            <View style={styles.estimatedEnd}>
              <Text style={styles.estimatedLabel}>ESTIMATED END</Text>
              <Text style={styles.estimatedTime}>08:45 PM</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Driver Card */}
        <View style={styles.driverCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=11" }}
            style={styles.driverImg}
          />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Marcus O.</Text>
            <Text style={styles.driverTier}>Black Tier Captain</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>4.9★</Text>
            </View>
          </View>
          <View style={styles.driverActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="call" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="chatbubble" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.vehicleInfo}>
          <View style={styles.vehicleCard}>
            <Text style={styles.vehicleLabel}>PLATE NUMBER</Text>
            <Text style={styles.vehicleValue}>AZL-409-TX</Text>
          </View>
          <View style={styles.vehicleCard}>
            <Text style={styles.vehicleLabel}>VEHICLE</Text>
            <Text style={styles.vehicleValue}>Lexus LX 570</Text>
          </View>
        </View>

        {/* SOS Button */}
        <TouchableOpacity style={styles.sosBtn}>
          <Ionicons name="warning" size={24} color="#E53935" />
          <Text style={styles.sosText}>SOS EMERGENCY</Text>
        </TouchableOpacity>

        {/* Complete Trip Button (Demo) */}
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={() => router.replace("/trip-completed")}
        >
          <Text style={styles.completeText}>Complete Trip (Demo)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  liveDot: {
    width: 8,
    height: 8,
    backgroundColor: "#E53935",
    borderRadius: 4,
  },
  headerText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholder: {
    alignItems: "center",
  },
  arrivingBadge: {
    position: "absolute",
    top: 100,
    backgroundColor: "#E53935",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  arrivingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  arrivingTime: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  carMarker: {
    position: "absolute",
    width: 48,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSheet: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#3A3A3A",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
  tripInfo: {
    marginBottom: 20,
  },
  activeTripLabel: {
    color: "#B0B0B0",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  routeFrom: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
  },
  routeTo: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
  },
  estimatedEnd: {
    alignItems: "flex-end",
  },
  estimatedLabel: {
    color: "#B0B0B0",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
  },
  estimatedTime: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#3A3A3A",
    borderRadius: 2,
    marginTop: 12,
  },
  progressFill: {
    width: "60%",
    height: "100%",
    backgroundColor: "#E53935",
    borderRadius: 2,
  },
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  driverImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  driverTier: {
    color: "#B0B0B0",
    fontSize: 12,
    marginTop: 4,
  },
  ratingBadge: {
    backgroundColor: "#E53935",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  driverActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    width: 44,
    height: 44,
    backgroundColor: "#3A3A3A",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  vehicleInfo: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  vehicleCard: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  vehicleLabel: {
    color: "#B0B0B0",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
  },
  vehicleValue: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    marginTop: 6,
  },
  sosBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E53935",
    gap: 10,
    marginBottom: 12,
  },
  sosText: {
    color: "#E53935",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  completeBtn: {
    backgroundColor: "#2A2A2A",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  completeText: {
    color: "#B0B0B0",
    fontWeight: "600",
    fontSize: 14,
  },
});

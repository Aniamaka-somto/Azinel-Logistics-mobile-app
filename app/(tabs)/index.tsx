import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>GOOD MORNING,</Text>
          <Text style={styles.userName}>Chidinma 👋</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications" size={24} color="#fff" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <View style={styles.inputField}>
          <Ionicons name="location" size={24} color="#E53935" />
          <View style={styles.inputTextContainer}>
            <Text style={styles.inputLabel}>PICKUP POINT</Text>
            <Text style={styles.inputValue}>Port Harcourt</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.inputField}>
          <Ionicons name="flag" size={24} color="#B0B0B0" />
          <View style={styles.inputTextContainer}>
            <Text style={styles.inputLabel}>DESTINATION</Text>
            <Text style={styles.inputValuePlaceholder}>Where to?</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.findBtn}
          onPress={() => router.push("/ride-selection")}
        >
          <Text style={styles.findBtnText}>Find Available Rides</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.actionsRow}
      >
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnActive]}>
          <Ionicons name="car" size={24} color="#fff" />
          <Text style={[styles.actionText, styles.actionTextActive]}>Ride</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="package" size={24} color="#B0B0B0" />
          <Text style={styles.actionText}>Logistics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="refresh" size={24} color="#B0B0B0" />
          <Text style={styles.actionText}>Recurring</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Upcoming Trip */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>UPCOMING TRIP</Text>
          <Text style={styles.viewAll}>VIEW ALL</Text>
        </View>

        <TouchableOpacity
          style={styles.tripCard}
          onPress={() => router.push("/live-tracking")}
        >
          <View style={styles.tripHeader}>
            <View style={styles.routeContainer}>
              <Text style={styles.routeFrom}>PHC</Text>
              <Ionicons name="arrow-forward" size={20} color="#E53935" />
              <Text style={styles.routeTo}>Lagos</Text>
            </View>
            <Text style={styles.price}>₦28,500</Text>
          </View>

          <View style={styles.tripMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>Tomorrow · 6:30 AM</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaBadgeText}>SUV</Text>
            </View>
            <Text style={styles.tripType}>Shared Trip</Text>
          </View>

          <View style={styles.driverInfo}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=11" }}
              style={styles.driverImg}
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>Emeka K.</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={12} color="#FF9800" />
                <Text style={styles.rating}>4.9 (124 trips)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.chatBtn}>
              <Ionicons name="chatbubble" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      {/* Live Tracking Preview */}
      <View style={styles.trackingCard}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={40} color="#3A3A3A" />
          <Text style={styles.mapText}>LIVE TRACKING ACTIVE</Text>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  header: {
    padding: 20,
    paddingTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  userName: { color: "#fff", fontSize: 28, fontWeight: "bold", marginTop: 4 },
  notificationBtn: {
    width: 48,
    height: 48,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    backgroundColor: "#E53935",
    borderRadius: 4,
  },
  searchBox: {
    margin: 20,
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  inputTextContainer: { marginLeft: 12, flex: 1 },
  inputLabel: {
    color: "#B0B0B0",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
  },
  inputValue: { color: "#fff", fontSize: 16, fontWeight: "600", marginTop: 4 },
  inputValuePlaceholder: {
    color: "#B0B0B0",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  divider: { height: 1, backgroundColor: "#3A3A3A", marginVertical: 8 },
  findBtn: {
    backgroundColor: "#E53935",
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  findBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
  },
  actionsRow: { paddingHorizontal: 20, marginBottom: 20 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#2A2A2A",
    borderRadius: 30,
    marginRight: 12,
    gap: 8,
  },
  actionBtnActive: { backgroundColor: "#E53935" },
  actionText: { color: "#B0B0B0", fontSize: 14, fontWeight: "600" },
  actionTextActive: { color: "#fff" },
  section: { padding: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#B0B0B0",
    letterSpacing: 1,
  },
  viewAll: { color: "#E53935", fontSize: 12, fontWeight: "600" },
  tripCard: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E53935",
    borderLeftWidth: 3,
  },
  tripHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  routeContainer: { flexDirection: "row", alignItems: "center", gap: 10 },
  routeFrom: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  routeTo: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  price: { color: "#E53935", fontSize: 20, fontWeight: "bold" },
  tripMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },
  metaItem: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  metaText: { color: "#B0B0B0", fontSize: 12 },
  metaBadge: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  metaBadgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  tripType: { color: "#B0B0B0", fontSize: 12 },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
    paddingTop: 15,
  },
  driverImg: { width: 44, height: 44, borderRadius: 22 },
  driverDetails: { flex: 1, marginLeft: 12 },
  driverName: { color: "#fff", fontWeight: "600", fontSize: 14 },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  rating: { color: "#B0B0B0", fontSize: 12 },
  chatBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  trackingCard: {
    margin: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholder: { alignItems: "center" },
  mapText: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 10,
  },
});

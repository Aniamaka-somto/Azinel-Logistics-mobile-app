import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TripsScreen() {
  const trips = [
    {
      id: 1,
      route: "PHC → Lagos",
      date: "Oct 12 • 09:30 AM",
      price: "₦45,000",
      status: "Completed",
      icon: "bus-outline",
    },
    {
      id: 2,
      route: "Ikeja → Lekki",
      date: "Oct 10 • 06:15 PM",
      price: "₦12,400",
      status: "Completed",
      icon: "navigate-outline",
    },
    {
      id: 3,
      route: "Abuja → PHC",
      date: "Oct 08 • 11:00 AM",
      price: "₦0",
      status: "Cancelled",
      icon: "person",
    },
    {
      id: 4,
      route: "Ibadan → Lagos",
      date: "Starts in 2h 15m",
      price: "₦68,200",
      status: "Upcoming",
      icon: "bus-outline",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={20} color="#E53935" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {["ALL", "RIDES", "SHIPMENTS"].map((f, i) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, i === 0 && styles.filterChipActive]}
          >
            <Text
              style={[
                styles.filterChipText,
                i === 0 && styles.filterChipTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trip List */}
      {trips.map((trip) => (
        <View key={trip.id} style={styles.tripCard}>
          <View style={styles.tripHeader}>
            <View style={styles.iconBox}>
              <Ionicons name={trip.icon as any} size={20} color="#E53935" />
            </View>
            <View style={styles.tripInfo}>
              <Text style={styles.tripRoute}>{trip.route}</Text>
              <Text style={styles.tripDate}>{trip.date}</Text>
            </View>
            <View style={styles.tripRight}>
              <Text style={styles.tripPrice}>{trip.price}</Text>
              <View
                style={[
                  styles.statusBadge,
                  trip.status === "Completed"
                    ? styles.statusCompleted
                    : trip.status === "Cancelled"
                      ? styles.statusCancelled
                      : styles.statusUpcoming,
                ]}
              >
                <Text style={styles.statusText}>{trip.status}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}

      {/* Insight Card */}
      <View style={styles.insightCard}>
        <Text style={styles.insightLabel}>EXCLUSIVE INSIGHT</Text>
        <Text style={styles.insightTitle}>
          YOU TRAVELLED 2,450KM THIS MONTH.
        </Text>
        <View style={styles.insightGrid}>
          <View style={styles.insightBox}>
            <Text style={styles.insightValue}>₦45k</Text>
            <Text style={styles.insightSub}>SAVINGS</Text>
          </View>
          <View style={styles.insightBox}>
            <Text style={styles.insightValue}>12</Text>
            <Text style={styles.insightSub}>DELIVERIES</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: { color: "#fff", fontSize: 32, fontWeight: "900" },
  filterBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  filterRow: { flexDirection: "row", paddingHorizontal: 20, marginBottom: 20 },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    marginRight: 10,
  },
  filterChipActive: { backgroundColor: "#E53935" },
  filterChipText: { color: "#B0B0B0", fontSize: 12, fontWeight: "700" },
  filterChipTextActive: { color: "#fff" },
  tripCard: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  tripHeader: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tripInfo: { flex: 1 },
  tripRoute: { color: "#fff", fontWeight: "700", fontSize: 16 },
  tripDate: { color: "#B0B0B0", fontSize: 12, marginTop: 4 },
  tripRight: { alignItems: "flex-end" },
  tripPrice: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 6,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusCompleted: { backgroundColor: "#3A3A3A" },
  statusCancelled: { backgroundColor: "#E53935" },
  statusUpcoming: { backgroundColor: "#E53935" },
  statusText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  insightCard: {
    margin: 20,
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  insightLabel: {
    color: "#E53935",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  insightTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 8,
    lineHeight: 28,
  },
  insightGrid: { flexDirection: "row", marginTop: 20, gap: 12 },
  insightBox: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 12,
  },
  insightValue: { color: "#fff", fontSize: 18, fontWeight: "700" },
  insightSub: { color: "#B0B0B0", fontSize: 10, marginTop: 4 },
});

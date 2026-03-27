import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RideSelectionScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const drivers = [
    {
      id: 1,
      name: "Kingsley Okoro",
      car: "Mercedes E-Class",
      time: "09:30 AM",
      price: "₦45,000",
      rating: "4.9",
      feature: "Toll fees included",
      image: "https://i.pravatar.cc/150?img=11",
    },
    {
      id: 2,
      name: "Sade Williams",
      car: "Toyota Land Cruiser",
      time: "10:45 AM",
      price: "₦62,000",
      rating: "4.7",
      feature: "Executive SUV experience",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 3,
      name: "Ibrahim Musa",
      car: "Lexus ES 350",
      time: "01:15 PM",
      price: "₦48,500",
      rating: "5.0",
      feature: "Free WiFi & Water",
      image: "https://i.pravatar.cc/150?img=3",
    },
  ];

  const filters = ["ALL", "SEDAN", "SUV", "LUXURY", "VAN"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.logo}>AZINEL</Text>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=11" }}
          style={styles.profileImg}
        />
      </View>

      {/* Route Info */}
      <View style={styles.routeSection}>
        <Text style={styles.route}>PHC → Abuja</Text>
        <Text style={styles.routeMeta}>OCT 24 • 1 PASSENGER</Text>
        <TouchableOpacity style={styles.filterIcon}>
          <Ionicons name="tune" size={20} color="#E53935" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Driver List */}
      <ScrollView
        style={styles.driverList}
        showsVerticalScrollIndicator={false}
      >
        {drivers.map((driver) => (
          <View key={driver.id} style={styles.driverCard}>
            <View style={styles.driverHeader}>
              <Image source={{ uri: driver.image }} style={styles.driverImg} />
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color="#E53935" />
                  <Text style={styles.rating}>{driver.rating}</Text>
                  <View style={styles.carBadge}>
                    <Text style={styles.carText}>{driver.car}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.departureInfo}>
                <Text style={styles.departureLabel}>DEPARTURE</Text>
                <Text style={styles.departureTime}>{driver.time}</Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <View>
                <Text style={styles.price}>{driver.price}</Text>
                <Text style={styles.feature}>{driver.feature}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.negotiateBtn}>
                  <Text style={styles.negotiateText}>NEGOTIATE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => router.push("/live-tracking")}
                >
                  <Text style={styles.bookText}>Book</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
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
  },
  logo: {
    color: "#E53935",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  routeSection: {
    padding: 20,
    paddingTop: 10,
  },
  route: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
  },
  routeMeta: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    letterSpacing: 1,
  },
  filterIcon: {
    position: "absolute",
    right: 20,
    top: 10,
    width: 44,
    height: 44,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filterRow: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#1A1A1A",
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: "#E53935",
  },
  filterChipText: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  filterChipTextActive: {
    color: "#fff",
  },
  driverList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  driverCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  driverImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2A2A2A",
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rating: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  carBadge: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  carText: {
    color: "#B0B0B0",
    fontSize: 10,
  },
  departureInfo: {
    alignItems: "flex-end",
  },
  departureLabel: {
    color: "#B0B0B0",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
  },
  departureTime: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 16,
  },
  price: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },
  feature: {
    color: "#B0B0B0",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  negotiateBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#2A1A1A",
    borderWidth: 1,
    borderColor: "#E53935",
  },
  negotiateText: {
    color: "#E53935",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  bookBtn: {
    backgroundColor: "#E53935",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  bookText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});

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
        <View style={styles.routeRow}>
          <Text style={styles.route}>PHC → Abuja</Text>
          <TouchableOpacity style={styles.filterIcon}>
            <Ionicons name="options-outline" size={20} color="#E53935" />
          </TouchableOpacity>
        </View>
        <Text style={styles.routeMeta}>OCT 24 • 1 PASSENGER</Text>
      </View>

      {/* Filter Tabs - Shorter Height */}
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
            {/* Top Section: Driver Info */}
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

            {/* Bottom Section: Price & Action */}
            <View style={styles.priceRow}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{driver.price}</Text>
                <Text style={styles.feature}>{driver.feature}</Text>
              </View>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => router.push("/ride-negotiation")}
              >
                <Text style={styles.bookText}>Select</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 120 }} />
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
  routeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    flexGrow: 0, // stop it from expanding
    flexShrink: 1, // allow it to shrink
    maxHeight: 60, // hard cap the container height
  },
  filterChip: {
    width: 90,
    height: 36, // was 60 — this was the culprit
    borderRadius: 15,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  filterChipActive: {
    backgroundColor: "#E53935",
    borderColor: "#E53935",
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
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  driverImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2A2A2A",
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16,
  },
  driverName: {
    color: "#fff",
    fontSize: 16,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
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
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },
  feature: {
    color: "#B0B0B0",
    fontSize: 11,
    marginTop: 4,
    fontStyle: "italic",
  },
  bookBtn: {
    backgroundColor: "#E53935",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  bookText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

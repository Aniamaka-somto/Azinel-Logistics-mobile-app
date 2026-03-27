import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
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

export default function BookTripScreen() {
  const router = useRouter();
  const [selectedFleet, setSelectedFleet] = useState("sedan");
  const [offerValue, setOfferValue] = useState(42);

  const fleets = [
    { id: "sedan", name: "Sedan", price: 42.0, icon: "car" },
    { id: "suv", name: "SUV", price: 65.0, icon: "bus" },
    { id: "bike", name: "Bike", price: 18.5, icon: "bicycle" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="menu" size={24} color="#fff" />
        <View style={styles.headerCenter}>
          <Text style={styles.subtitle}>LOGISTICS PORTAL</Text>
          <Text style={styles.title}>BOOK TRIP</Text>
        </View>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=11" }}
          style={styles.profileImg}
        />
      </View>

      {/* Map Visualization */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={80} color="#2A2A2A" />
          <View style={styles.routeLine}>
            <View style={styles.routePointStart} />
            <View style={styles.routeLineBar} />
            <View style={styles.routePointEnd} />
          </View>
        </View>

        <View style={styles.infoBoxes}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>DISTANCE</Text>
            <Text style={styles.infoValue}>12.4 KM</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>EST. TIME</Text>
            <Text style={styles.infoValue}>22 MIN</Text>
          </View>
        </View>
      </View>

      {/* Fleet Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SELECT FLEET</Text>
          <Text style={styles.availableText}>AVAILABLE NOW</Text>
        </View>

        <View style={styles.fleetRow}>
          {fleets.map((fleet) => (
            <TouchableOpacity
              key={fleet.id}
              style={[
                styles.fleetCard,
                selectedFleet === fleet.id && styles.fleetCardSelected,
              ]}
              onPress={() => setSelectedFleet(fleet.id)}
            >
              <Ionicons
                name={fleet.icon as any}
                size={32}
                color={selectedFleet === fleet.id ? "#E53935" : "#B0B0B0"}
              />
              <Text
                style={[
                  styles.fleetName,
                  selectedFleet === fleet.id && styles.fleetNameSelected,
                ]}
              >
                {fleet.name}
              </Text>
              <Text
                style={[
                  styles.fleetPrice,
                  selectedFleet === fleet.id && styles.fleetPriceSelected,
                ]}
              >
                ${fleet.price.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Negotiate Fare */}
      <View style={styles.negotiateCard}>
        <View style={styles.negotiateHeader}>
          <Text style={styles.negotiateTitle}>NEGOTIATE FARE</Text>
          <Ionicons name="gavel" size={24} color="#E53935" />
        </View>
        <Text style={styles.negotiateSubtitle}>
          Secure the best rate for your route
        </Text>

        <View style={styles.offerRow}>
          <View style={styles.offerSide}>
            <Text style={styles.offerLabel}>DRIVER ASKING</Text>
            <Text style={styles.offerValue}>$48.00</Text>
          </View>

          <Ionicons
            name="compare"
            size={24}
            color="#3A3A3A"
            style={styles.compareIcon}
          />

          <View style={styles.offerSide}>
            <Text style={styles.offerLabel}>YOUR OFFER</Text>
            <Text style={[styles.offerValue, styles.offerValueRed]}>
              ${offerValue.toFixed(2)}
            </Text>
          </View>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={35}
          maximumValue={55}
          step={1}
          value={offerValue}
          onValueChange={setOfferValue}
          minimumTrackTintColor="#E53935"
          maximumTrackTintColor="#3A3A3A"
          thumbTintColor="#E53935"
        />

        <View style={styles.rangeLabels}>
          <Text style={styles.rangeText}>$35.00 (LOW)</Text>
          <Text style={styles.rangeText}>$55.00 (HIGH)</Text>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity
        style={styles.confirmBtn}
        onPress={() => router.push("/live-tracking")}
      >
        <Text style={styles.confirmText}>CONFIRM BOOKING</Text>
        <Ionicons name="bolt" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
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
  headerCenter: {
    alignItems: "center",
    flex: 1,
  },
  subtitle: {
    color: "#E53935",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 4,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  mapContainer: {
    margin: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    overflow: "hidden",
  },
  mapPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  routePointStart: {
    width: 14,
    height: 14,
    backgroundColor: "#E53935",
    borderRadius: 7,
  },
  routeLineBar: {
    width: 120,
    height: 3,
    backgroundColor: "#E53935",
    marginHorizontal: 15,
  },
  routePointEnd: {
    width: 14,
    height: 14,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  infoBoxes: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  infoBox: {
    backgroundColor: "#2A2A2A",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: "center",
  },
  infoLabel: {
    color: "#B0B0B0",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  infoValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  availableText: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  fleetRow: {
    flexDirection: "row",
    gap: 12,
  },
  fleetCard: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  fleetCardSelected: {
    borderColor: "#E53935",
    backgroundColor: "#1A1A1A",
  },
  fleetName: {
    color: "#B0B0B0",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
  },
  fleetNameSelected: {
    color: "#E53935",
  },
  fleetPrice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 6,
  },
  fleetPriceSelected: {
    color: "#E53935",
  },
  negotiateCard: {
    backgroundColor: "#1A1A1A",
    margin: 20,
    padding: 24,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E53935",
  },
  negotiateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  negotiateTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  negotiateSubtitle: {
    color: "#B0B0B0",
    fontSize: 12,
    marginBottom: 24,
  },
  offerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  offerSide: {
    alignItems: "center",
    flex: 1,
  },
  offerLabel: {
    color: "#B0B0B0",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  offerValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },
  offerValueRed: {
    color: "#E53935",
  },
  compareIcon: {
    marginHorizontal: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  rangeText: {
    color: "#3A3A3A",
    fontSize: 10,
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: "#E53935",
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  confirmText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
});

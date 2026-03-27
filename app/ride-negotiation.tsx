import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RideNegotiationScreen() {
  const router = useRouter();
  const [selectedFleet, setSelectedFleet] = useState("suv");
  const [offerValue, setOfferValue] = useState(64200);

  const fleets = [
    {
      id: "sedan",
      name: "Executive Sedan",
      price: 45000,
      icon: "car",
      base: "₦45,000 BASE",
    },
    {
      id: "suv",
      name: "Grand SUV",
      price: 68500,
      icon: "bus",
      base: "₦68,500 BASE",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#E53935" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NEGOTIATION</Text>
        <Text style={styles.tripId}>TRIP ID: AZ-992</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Route Map Section */}
        <View style={styles.routeSection}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.routePoints}>
              <View style={styles.routePoint}>
                <Text style={styles.routeCode}>PHC</Text>
                <Text style={styles.routeCity}>Port Harcourt</Text>
              </View>
              <View style={styles.routeLineContainer}>
                <View style={styles.routeLine} />
                <View style={styles.routeDot} />
                <Text style={styles.distanceText}>612 KM REMAINING</Text>
              </View>
              <View style={styles.routePoint}>
                <Text style={styles.routeCode}>LOS</Text>
                <Text style={styles.routeCity}>Lagos Central</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fleet Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SELECT FLEET</Text>
            <Text style={styles.sectionSubtitle}>3 CLASSES AVAILABLE</Text>
          </View>

          <View style={styles.fleetGrid}>
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
                  color={selectedFleet === fleet.id ? "#E53935" : "#3A3A3A"}
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
                    styles.fleetBase,
                    selectedFleet === fleet.id && styles.fleetBaseSelected,
                  ]}
                >
                  {fleet.base}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Negotiation Card */}
        <View style={styles.negotiateCard}>
          <View style={styles.priceRow}>
            <View style={styles.priceSide}>
              <Text style={styles.priceLabel}>DRIVER ASKING</Text>
              <Text style={styles.priceValue}>₦75,000</Text>
            </View>

            <Ionicons
              name="sync"
              size={24}
              color="#3A3A3A"
              style={styles.syncIcon}
            />

            <View style={styles.priceSide}>
              <Text style={styles.priceLabel}>YOUR OFFER</Text>
              <Text style={[styles.priceValue, styles.priceValueRed]}>
                ₦{offerValue.toLocaleString()}
              </Text>
            </View>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={45000}
            maximumValue={90000}
            step={1000}
            value={offerValue}
            onValueChange={setOfferValue}
            minimumTrackTintColor="#E53935"
            maximumTrackTintColor="#3A3A3A"
            thumbTintColor="#E53935"
          />

          <View style={styles.rangeLabels}>
            <View>
              <Text style={styles.rangeLabel}>MINIMUM BID</Text>
              <Text style={styles.rangeValue}>₦45,000</Text>
            </View>
            <View>
              <Text style={styles.rangeLabel}>RECOMMENDED</Text>
              <Text style={styles.rangeValue}>₦90,000</Text>
            </View>
          </View>

          <View style={styles.hintBox}>
            <View style={styles.hintDot} />
            <Text style={styles.hintText}>
              "High demand on this route. Quick match likely at this price."
            </Text>
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

        {/* Footer */}
        <Text style={styles.footer}>
          AZINEL SECURE ESCROW • 24/7 ROADSIDE INTELLIGENCE • TIER 1 DRIVERS
        </Text>

        <View style={{ height: 40 }} />
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
  headerTitle: {
    color: "#E53935",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
  tripId: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  routeSection: {
    padding: 20,
  },
  mapPlaceholder: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 30,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  routePoints: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  routePoint: {
    alignItems: "center",
  },
  routeCode: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
  },
  routeCity: {
    color: "#B0B0B0",
    fontSize: 10,
    marginTop: 4,
  },
  routeLineContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  routeLine: {
    width: "100%",
    height: 2,
    backgroundColor: "#E53935",
  },
  routeDot: {
    width: 12,
    height: 12,
    backgroundColor: "#E53935",
    borderRadius: 6,
    marginVertical: 4,
  },
  distanceText: {
    color: "#E53935",
    fontSize: 8,
    fontWeight: "700",
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontStyle: "italic",
  },
  sectionSubtitle: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  fleetGrid: {
    flexDirection: "row",
    gap: 12,
  },
  fleetCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  fleetCardSelected: {
    borderColor: "#E53935",
    backgroundColor: "#2A1A1A",
  },
  fleetName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
  },
  fleetNameSelected: {
    color: "#E53935",
  },
  fleetBase: {
    color: "#3A3A3A",
    fontSize: 10,
    marginTop: 6,
  },
  fleetBaseSelected: {
    color: "#E53935",
  },
  negotiateCard: {
    backgroundColor: "#1A1A1A",
    margin: 20,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  priceSide: {
    flex: 1,
    alignItems: "center",
  },
  priceLabel: {
    color: "#B0B0B0",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  priceValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },
  priceValueRed: {
    color: "#E53935",
  },
  syncIcon: {
    marginHorizontal: 10,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 16,
  },
  rangeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  rangeLabel: {
    color: "#3A3A3A",
    fontSize: 10,
    fontWeight: "700",
  },
  rangeValue: {
    color: "#B0B0B0",
    fontSize: 12,
    marginTop: 4,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    backgroundColor: "#2A1A1A",
    borderRadius: 8,
  },
  hintDot: {
    width: 6,
    height: 6,
    backgroundColor: "#E53935",
    borderRadius: 3,
    marginTop: 6,
  },
  hintText: {
    color: "#B0B0B0",
    fontSize: 12,
    fontStyle: "italic",
    flex: 1,
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
  },
  confirmText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
  footer: {
    color: "#3A3A3A",
    fontSize: 8,
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
});

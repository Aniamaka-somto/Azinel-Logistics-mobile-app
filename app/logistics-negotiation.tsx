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

export default function LogisticsNegotiationScreen() {
  const router = useRouter();
  const [selectedAsset, setSelectedAsset] = useState("van");
  const [offerValue, setOfferValue] = useState(42.5);

  const assets = [
    {
      id: "bike",
      name: "Eco Bike",
      price: 12.5,
      payload: "Max 30kg",
      icon: "bicycle",
    },
    {
      id: "van",
      name: "Cargo Van",
      price: 45.0,
      payload: "Max 800kg",
      icon: "bus",
    },
    {
      id: "truck",
      name: "Heavy Truck",
      price: 120.0,
      payload: "Max 5 Tons",
      icon: "truck",
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
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=11" }}
          style={styles.profileImg}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Shipment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleLarge}>Shipment Details</Text>

          <View style={styles.shipmentCard}>
            <View style={styles.routeLineVertical}>
              <View style={styles.routeDotStart} />
              <View style={styles.routeLineVerticalBar} />
              <View style={styles.routeDotEnd} />
            </View>

            <View style={styles.shipmentInfo}>
              <View style={styles.shipmentPoint}>
                <Text style={styles.shipmentLabel}>PICKUP</Text>
                <Text style={styles.shipmentValue}>
                  Industrial Zone, Sector 4
                </Text>
              </View>
              <View style={styles.shipmentPoint}>
                <Text style={styles.shipmentLabel}>DELIVERY</Text>
                <Text style={styles.shipmentValue}>
                  Prime Plaza, Downtown Core
                </Text>
              </View>
            </View>

            <View style={styles.packageInfo}>
              <View style={styles.packageIcon}>
                <Ionicons name="cube" size={20} color="#E53935" />
              </View>
              <View style={styles.packageDetails}>
                <Text style={styles.packageName}>Medium Box</Text>
                <Text style={styles.packageWeight}>Weight: 25kg</Text>
              </View>
              <View style={styles.fragileBadge}>
                <Text style={styles.fragileText}>FRAGILE</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Asset Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Asset</Text>
            <Text style={styles.sectionSubtitle}>3 Options Available</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.assetScroll}
          >
            {assets.map((asset) => (
              <TouchableOpacity
                key={asset.id}
                style={[
                  styles.assetCard,
                  selectedAsset === asset.id && styles.assetCardSelected,
                ]}
                onPress={() => setSelectedAsset(asset.id)}
              >
                <Ionicons
                  name={asset.icon as any}
                  size={32}
                  color={selectedAsset === asset.id ? "#E53935" : "#3A3A3A"}
                />
                <Text
                  style={[
                    styles.assetName,
                    selectedAsset === asset.id && styles.assetNameSelected,
                  ]}
                >
                  {asset.name}
                </Text>
                <Text style={styles.assetPayload}>{asset.payload}</Text>
                <Text
                  style={[
                    styles.assetPrice,
                    selectedAsset === asset.id && styles.assetPriceSelected,
                  ]}
                >
                  ${asset.price.toFixed(2)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Price Negotiation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Negotiation</Text>

          <View style={styles.negotiateCard}>
            <View style={styles.negotiateHeader}>
              <View>
                <Text style={styles.baseLabel}>BASE FEE</Text>
                <Text style={styles.basePrice}>$45.00</Text>
              </View>
              <View style={styles.offerSection}>
                <Text style={styles.offerLabel}>YOUR OFFER</Text>
                <Text style={styles.offerPrice}>${offerValue.toFixed(2)}</Text>
              </View>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={38}
              maximumValue={55}
              step={0.5}
              value={offerValue}
              onValueChange={setOfferValue}
              minimumTrackTintColor="#E53935"
              maximumTrackTintColor="#3A3A3A"
              thumbTintColor="#E53935"
            />

            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>$38.00 (MIN)</Text>
              <Text style={styles.sliderLabel}>$55.00 (MAX)</Text>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                Handling charges and fuel surcharges included in final offer.
              </Text>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => router.push("/live-tracking")}
        >
          <Text style={styles.confirmText}>Schedule Cargo Pickup</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>
          TERMS OF SERVICE & INSURANCE COVERAGE APPLY
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
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  section: {
    padding: 20,
  },
  sectionTitleLarge: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionSubtitle: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  shipmentCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  routeLineVertical: {
    alignItems: "center",
    marginBottom: 16,
  },
  routeDotStart: {
    width: 10,
    height: 10,
    backgroundColor: "#E53935",
    borderRadius: 5,
  },
  routeLineVerticalBar: {
    width: 2,
    height: 40,
    backgroundColor: "#3A3A3A",
    marginVertical: 4,
  },
  routeDotEnd: {
    width: 10,
    height: 10,
    backgroundColor: "#3A3A3A",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#B0B0B0",
  },
  shipmentInfo: {
    marginBottom: 16,
  },
  shipmentPoint: {
    marginBottom: 12,
  },
  shipmentLabel: {
    color: "#E53935",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  shipmentValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  packageInfo: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
    paddingTop: 16,
  },
  packageIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#2A1A1A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  packageDetails: {
    flex: 1,
    marginLeft: 12,
  },
  packageName: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  packageWeight: {
    color: "#B0B0B0",
    fontSize: 12,
    marginTop: 2,
  },
  fragileBadge: {
    backgroundColor: "#2A1A1A",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  fragileText: {
    color: "#E53935",
    fontSize: 10,
    fontWeight: "700",
  },
  assetScroll: {
    marginBottom: 20,
  },
  assetCard: {
    width: 140,
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  assetCardSelected: {
    borderColor: "#E53935",
    backgroundColor: "#2A1A1A",
  },
  assetName: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
  },
  assetNameSelected: {
    color: "#E53935",
  },
  assetPayload: {
    color: "#B0B0B0",
    fontSize: 10,
    marginTop: 6,
  },
  assetPrice: {
    color: "#E53935",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
  assetPriceSelected: {
    color: "#E53935",
  },
  negotiateCard: {
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  negotiateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  baseLabel: {
    color: "#3A3A3A",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  basePrice: {
    color: "#3A3A3A",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 4,
  },
  offerSection: {
    alignItems: "flex-end",
  },
  offerLabel: {
    color: "#E53935",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  offerPrice: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 4,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 8,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sliderLabel: {
    color: "#3A3A3A",
    fontSize: 10,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    backgroundColor: "#2A1A1A",
    borderRadius: 8,
  },
  infoDot: {
    width: 6,
    height: 6,
    backgroundColor: "#E53935",
    borderRadius: 3,
    marginTop: 6,
  },
  infoText: {
    color: "#B0B0B0",
    fontSize: 12,
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

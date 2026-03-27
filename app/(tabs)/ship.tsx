import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function ShipScreen() {
  const [selectedPackage, setSelectedPackage] = useState("medium");
  const [deliveryType, setDeliveryType] = useState("door");

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
        <Text style={styles.headerTitle}>SHIP A PACKAGE</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>PICKUP LOCATION</Text>
        <View style={styles.inputBox}>
          <Ionicons name="location-outline" size={20} color="#B0B0B0" />
          <TextInput
            style={styles.input}
            placeholder="Enter pickup address"
            placeholderTextColor="#3A3A3A"
          />
        </View>

        <Text style={styles.label}>DELIVERY DESTINATION</Text>
        <View style={styles.inputBox}>
          <Ionicons name="navigate-outline" size={20} color="#B0B0B0" />
          <TextInput
            style={styles.input}
            placeholder="Enter delivery destination"
            placeholderTextColor="#3A3A3A"
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>PACKAGE DETAILS</Text>
      <View style={styles.packageGrid}>
        {["small", "medium", "large", "custom"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.packageCard,
              selectedPackage === type && styles.packageCardSelected,
            ]}
            onPress={() => setSelectedPackage(type)}
          >
            <Ionicons
              name={type === "custom" ? "create-outline" : "cube-outline"}
              size={24}
              color={selectedPackage === type ? "#E53935" : "#B0B0B0"}
            />
            <Text
              style={[
                styles.packageText,
                selectedPackage === type && styles.packageTextSelected,
              ]}
            >
              {type === "small"
                ? "Small Parcel"
                : type === "medium"
                  ? "Medium Box"
                  : type === "large"
                    ? "Large Cargo"
                    : "Custom"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>ESTIMATED WEIGHT (KG)</Text>
      <View style={styles.weightInput}>
        <TextInput
          style={styles.weightTextInput}
          placeholder="0.0"
          placeholderTextColor="#3A3A3A"
          keyboardType="numeric"
        />
        <Text style={styles.kgText}>KG</Text>
      </View>

      <Text style={styles.label}>DELIVERY TYPE</Text>
      <View style={styles.deliveryToggle}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            deliveryType === "door" && styles.toggleBtnActive,
          ]}
          onPress={() => setDeliveryType("door")}
        >
          <Text
            style={[
              styles.toggleText,
              deliveryType === "door" && styles.toggleTextActive,
            ]}
          >
            DOOR-TO-DOOR
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            deliveryType === "terminal" && styles.toggleBtnActive,
          ]}
          onPress={() => setDeliveryType("terminal")}
        >
          <Text
            style={[
              styles.toggleText,
              deliveryType === "terminal" && styles.toggleTextActive,
            ]}
          >
            TERMINAL PICKUP
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => router.push("/logistics-negotiation")}
      >
        <Text style={styles.submitText}>Get Delivery Quotes</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>

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
  headerTitle: {
    color: "#E53935",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1,
  },
  formSection: { padding: 20 },
  label: {
    color: "#3A3A3A",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 16,
  },
  input: { flex: 1, color: "#fff", marginLeft: 12 },
  sectionTitle: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  packageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  packageCard: {
    width: "48%",
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  packageCardSelected: { borderColor: "#E53935", backgroundColor: "#2A1A1A" },
  packageText: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  packageTextSelected: { color: "#E53935" },
  weightInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 20,
    height: 56,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  weightTextInput: {
    flex: 1,
    color: "#000000",
    fontSize: 18,
    fontWeight: "700",
  },
  kgText: { color: "#B0B0B0", fontWeight: "600" },
  deliveryToggle: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  toggleBtnActive: { backgroundColor: "#E53935" },
  toggleText: { color: "#B0B0B0", fontSize: 12, fontWeight: "700" },
  toggleTextActive: { color: "#fff" },
  submitBtn: {
    backgroundColor: "#E53935",
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    marginRight: 10,
  },
});

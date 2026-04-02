import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Input from "../../components/Input";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { useRideStore } from "../../store/useRideStore";

const SUGGESTIONS = [
  {
    id: "1",
    name: "Oba Market",
    address: "Oba Market Rd, Benin City",
    lat: 6.336,
    lng: 5.624,
  },
  {
    id: "2",
    name: "University of Benin",
    address: "Ugbowo, Benin City",
    lat: 6.374,
    lng: 5.633,
  },
  {
    id: "3",
    name: "Benin Airport",
    address: "Airport Rd, Benin City",
    lat: 6.317,
    lng: 5.6,
  },
  {
    id: "4",
    name: "Ring Road",
    address: "Ring Road, Benin City",
    lat: 6.34,
    lng: 5.63,
  },
  {
    id: "5",
    name: "GRA Benin",
    address: "Government Reserved Area",
    lat: 6.35,
    lng: 5.615,
  },
];

export default function Search() {
  const [query, setQuery] = useState("");
  const { setDestination } = useRideStore();

  const filtered = query
    ? SUGGESTIONS.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()),
      )
    : SUGGESTIONS;

  const handleSelect = (item: (typeof SUGGESTIONS)[0]) => {
    setDestination({ latitude: item.lat, longitude: item.lng });
    router.push("/(user)/ride-options");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#111" />
      </TouchableOpacity>

      <Text style={styles.header}>Where to?</Text>

      <View style={styles.inputs}>
        <View style={styles.inputRow}>
          <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
          <Input
            placeholder="Pickup location (current)"
            style={{ flex: 1 }}
            editable={false}
            value="Current Location"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.inputRow}>
          <View style={[styles.dot, { backgroundColor: "#111" }]} />
          <Input
            placeholder="Enter destination"
            style={{ flex: 1 }}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      </View>

      <Text style={styles.suggestLabel}>Suggestions</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: SPACING.sm }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestion}
            onPress={() => handleSelect(item)}
          >
            <View style={styles.pinIcon}>
              <Ionicons name="location" size={18} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.suggestName}>{item.name}</Text>
              <Text style={styles.suggestAddr}>{item.address}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.lg,
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
  inputs: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: SPACING.sm,
    marginLeft: 18,
  },
  suggestLabel: {
    fontWeight: "700",
    fontSize: 13,
    color: "#999",
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  pinIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
  },
  suggestName: { fontWeight: "600", color: "#111", fontSize: 14 },
  suggestAddr: { color: "#888", fontSize: 12, marginTop: 2 },
});

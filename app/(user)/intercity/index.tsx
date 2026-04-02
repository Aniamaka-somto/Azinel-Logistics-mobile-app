import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useState, useCallback } from "react";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import { useIntercityStore } from "../../../store/useIntercityStore";
import { searchPlaces, PlaceResult } from "../../../services/api";
import Input from "../../../components/Input";

type ActiveField = "origin" | "destination" | null;

export default function IntercityIndex() {
  const {
    originArea,
    destinationArea,
    setOriginArea,
    setDestinationArea,
    setOriginCity,
    setDestinationCity,
  } = useIntercityStore();

  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const data = await searchPlaces(text);
      setResults(data);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSelect = (place: PlaceResult) => {
    // Extract city from address e.g. "Victoria Island, Lagos" → "Lagos"
    const parts = place.address.split(",");
    const city = parts[parts.length - 1].trim();

    if (activeField === "origin") {
      setOriginArea({
        name: place.address,
        placeId: place.placeId,
        coordinates: place.coordinates,
      });
      setOriginCity(city);
    } else {
      setDestinationArea({
        name: place.address,
        placeId: place.placeId,
        coordinates: place.coordinates,
      });
      setDestinationCity(city);
    }

    setQuery("");
    setResults([]);
    setActiveField(null);
  };

  const canProceed = originArea && destinationArea;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Intercity Ride</Text>
      </View>

      {/* Route card */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={styles.routeCard}
      >
        {/* Origin field */}
        <TouchableOpacity
          style={styles.fieldRow}
          onPress={() => {
            setActiveField("origin");
            setQuery(originArea?.name ?? "");
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
          <View style={styles.fieldInfo}>
            <Text style={styles.fieldLabel}>From</Text>
            <Text
              style={[
                styles.fieldValue,
                !originArea && styles.fieldPlaceholder,
              ]}
              numberOfLines={1}
            >
              {originArea?.name ?? "Search departure location"}
            </Text>
          </View>
          {originArea && (
            <TouchableOpacity
              onPress={() => {
                setOriginArea(null as any);
                setOriginCity(null as any);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={20} color="#CCC" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <View style={styles.fieldDivider} />

        {/* Destination field */}
        <TouchableOpacity
          style={styles.fieldRow}
          onPress={() => {
            setActiveField("destination");
            setQuery(destinationArea?.name ?? "");
          }}
          activeOpacity={0.8}
        >
          <View style={[styles.dot, { backgroundColor: "#111" }]} />
          <View style={styles.fieldInfo}>
            <Text style={styles.fieldLabel}>To</Text>
            <Text
              style={[
                styles.fieldValue,
                !destinationArea && styles.fieldPlaceholder,
              ]}
              numberOfLines={1}
            >
              {destinationArea?.name ?? "Search destination"}
            </Text>
          </View>
          {destinationArea && (
            <TouchableOpacity
              onPress={() => {
                setDestinationArea(null as any);
                setDestinationCity(null as any);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={20} color="#CCC" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Search input — shown when a field is active */}
      {activeField && (
        <Animated.View entering={FadeIn.duration(200)} style={styles.searchBox}>
          <View style={styles.searchInputRow}>
            <Ionicons name="search" size={16} color="#999" />
            <Input
              placeholder={
                activeField === "origin"
                  ? "e.g. Victoria Island Lagos..."
                  : "e.g. Maitama Abuja..."
              }
              value={query}
              onChangeText={handleSearch}
              style={styles.searchInput}
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setQuery("");
                  setResults([]);
                }}
              >
                <Ionicons name="close" size={16} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Results */}
          {searching && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {!searching && results.length > 0 && (
            <ScrollView
              style={styles.results}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {results.map((place, i) => (
                <Animated.View
                  key={place.placeId}
                  entering={FadeInDown.delay(i * 50).duration(300)}
                >
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={() => handleSelect(place)}
                  >
                    <View style={styles.resultPin}>
                      <Ionicons
                        name="location"
                        size={16}
                        color={COLORS.primary}
                      />
                    </View>
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultName}>{place.name}</Text>
                      <Text style={styles.resultAddress}>{place.address}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </ScrollView>
          )}

          {!searching && query.length >= 2 && results.length === 0 && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>
                No locations found for &quot;{query}&quot;
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.cancelSearch}
            onPress={() => {
              setActiveField(null);
              setQuery("");
              setResults([]);
            }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Summary — show when both selected and not searching */}
      {canProceed && !activeField && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.summaryCard}
        >
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={COLORS.primary}
          />
          <Text style={styles.summaryText}>
            Route set. Next, pick your date, time and vehicle class.
          </Text>
        </Animated.View>
      )}

      {/* CTA */}
      {!activeField && (
        <TouchableOpacity
          style={[styles.proceedBtn, !canProceed && styles.proceedDisabled]}
          onPress={() => router.push("/(user)/intercity/schedule")}
          disabled={!canProceed}
        >
          <Text style={styles.proceedText}>
            {canProceed
              ? "Set Date & Time →"
              : "Search both locations to continue"}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginVertical: SPACING.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "800", color: "#111" },

  routeCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  fieldInfo: { flex: 1 },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldValue: { fontSize: 14, fontWeight: "600", color: "#111", marginTop: 2 },
  fieldPlaceholder: { color: "#BBB", fontWeight: "400" },
  fieldDivider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: SPACING.sm,
    marginLeft: 18,
  },

  searchBox: {
    backgroundColor: "#fff",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: SPACING.md,
    overflow: "hidden",
  },
  searchInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "transparent",
    padding: 0,
    fontSize: 15,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  loadingText: { fontSize: 13, color: "#999" },

  results: { maxHeight: 280 },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  resultPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
  },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 14, fontWeight: "600", color: "#111" },
  resultAddress: { fontSize: 12, color: "#888", marginTop: 2 },

  emptyRow: { padding: SPACING.md },
  emptyText: { fontSize: 13, color: "#999", textAlign: "center" },

  cancelSearch: {
    padding: SPACING.md,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  cancelText: { color: COLORS.primary, fontWeight: "600", fontSize: 14 },

  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: "#FFF5F6",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#FFD6DA",
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  summaryText: { flex: 1, fontSize: 13, color: "#555" },

  proceedBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
    position: "absolute",
    bottom: SPACING.lg,
    left: SPACING.lg,
    right: SPACING.lg,
  },
  proceedDisabled: { backgroundColor: "#DDD" },
  proceedText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

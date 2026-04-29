import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useState, useCallback, useEffect, useRef } from "react";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import { useIntercityStore } from "../../../store/useIntercityStore";
import { BASE_URL } from "../../../services/api";

type ActiveField = "origin" | "destination" | null;

interface PlaceResult {
  placeId: string;
  mainText: string;
  description: string;
  lat?: number;
  lng?: number;
}

// ─────────────────────────────────────────────
// API helper — intercity mode, loose location bias
// ─────────────────────────────────────────────

async function searchIntercityPlaces(
  query: string,
  lat?: number,
  lng?: number,
): Promise<PlaceResult[]> {
  if (!query.trim()) return [];
  const token = await AsyncStorage.getItem("token");

  const params = new URLSearchParams({ query, mode: "intercity" });
  if (lat && lng) {
    params.append("lat", String(lat));
    params.append("lng", String(lng));
  }

  const res = await fetch(`${BASE_URL}/places/search?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const json = await res.json();
  return json?.data ?? [];
}

async function getPlaceCoords(
  placeId: string,
  embeddedLat?: number,
  embeddedLng?: number,
): Promise<{ latitude: number; longitude: number; address: string }> {
  // Nominatim shortcut — skip the extra round-trip
  if (placeId.startsWith("nominatim_") && embeddedLat && embeddedLng) {
    return { latitude: embeddedLat, longitude: embeddedLng, address: "" };
  }

  const token = await AsyncStorage.getItem("token");
  const res = await fetch(
    `${BASE_URL}/places/details/${encodeURIComponent(placeId)}`,
    {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );
  const json = await res.json();
  return {
    latitude: json?.data?.lat,
    longitude: json?.data?.lng,
    address: json?.data?.address ?? "",
  };
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

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
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Get user location on mount ──
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch {
        // gracefully skip
      }
    })();
  }, []);

  const handleSearch = useCallback(
    async (text: string) => {
      setQuery(text);
      if (text.trim().length < 2) {
        setResults([]);
        return;
      }

      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(async () => {
        setSearching(true);
        try {
          const data = await searchIntercityPlaces(
            text,
            userLocation?.latitude,
            userLocation?.longitude,
          );
          setResults(data);
        } finally {
          setSearching(false);
        }
      }, 400);
    },
    [userLocation],
  );

  const handleSelect = async (place: PlaceResult) => {
    setSearching(true);
    try {
      const coords = await getPlaceCoords(place.placeId, place.lat, place.lng);
      const address = coords.address || place.description;

      // Extract city: last meaningful part of the address string
      const parts = place.description.split(",");
      const city =
        parts[parts.length - 2]?.trim() ??
        parts[parts.length - 1]?.trim() ??
        "";

      if (activeField === "origin") {
        setOriginArea({
          name: place.mainText || place.description,
          placeId: place.placeId,
          coordinates: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });
        setOriginCity(city);
      } else {
        setDestinationArea({
          name: place.mainText || place.description,
          placeId: place.placeId,
          coordinates: {
            latitude: coords.latitude,
            longitude: coords.longitude,
          },
        });
        setDestinationCity(city);
      }
    } catch (err) {
      console.warn("Could not resolve place:", err);
    } finally {
      setSearching(false);
      setQuery("");
      setResults([]);
      setActiveField(null);
    }
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
        {/* Origin */}
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

        {/* Destination */}
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
              {destinationArea?.name ?? "Search destination city"}
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
            <TextInput
              style={styles.searchInput}
              placeholder={
                activeField === "origin"
                  ? "e.g. Victoria Island Lagos..."
                  : "e.g. Maitama Abuja, Enugu city..."
              }
              placeholderTextColor="#BBB"
              value={query}
              onChangeText={handleSearch}
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

          {/* Hint */}
          <View style={styles.hintRow}>
            <Ionicons
              name="information-circle-outline"
              size={13}
              color="#BBB"
            />
            <Text style={styles.hintText}>
              Search any city or area in Nigeria — e.g. &quot;Asaba&quot;,
              &quot;Ikeja&quot;, &quot;Owerri&quot;
            </Text>
          </View>

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
                      <Text style={styles.resultName} numberOfLines={1}>
                        {place.mainText || place.description}
                      </Text>
                      <Text style={styles.resultAddress} numberOfLines={1}>
                        {place.description}
                      </Text>
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

      {/* Summary */}
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
    fontSize: 15,
    color: "#111",
    paddingVertical: 4,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F8F8",
  },
  hintText: { fontSize: 11, color: "#BBB", flex: 1 },

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

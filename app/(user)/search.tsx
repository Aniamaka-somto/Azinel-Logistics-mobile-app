import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState, useCallback, useRef, useEffect } from "react";
import * as Location from "expo-location";

import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { BASE_URL } from "../../services/api";
import { useRideStore } from "../../store/useRideStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ActiveField = "pickup" | "destination";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface PlaceResult {
  placeId: string;
  mainText: string;
  description: string;
  // Nominatim embeds coords directly so we can skip a round-trip
  lat?: number;
  lng?: number;
}

// ─────────────────────────────────────────────
// API helpers (inline so we can pass lat/lng)
// ─────────────────────────────────────────────

async function searchPlacesWithLocation(
  query: string,
  lat?: number,
  lng?: number,
): Promise<PlaceResult[]> {
  if (!query.trim()) return [];
  const token = await AsyncStorage.getItem("token");

  const params = new URLSearchParams({ query });
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

async function getPlaceDetails(
  placeId: string,
  embeddedLat?: number,
  embeddedLng?: number,
): Promise<{ latitude: number; longitude: number; address: string }> {
  // If Nominatim already gave us coords in the search result, skip the round-trip
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

export default function Search() {
  const { pickup, setPickup, setDestination } = useRideStore();

  const [activeField, setActiveField] = useState<ActiveField>("destination");
  const [pickupText, setPickupText] = useState("Current Location");
  const [destinationText, setDestinationText] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [pickupLocked, setPickupLocked] = useState(true);

  // User's real current location — used to bias search results
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const destinationRef = useRef<TextInput>(null);

  // ── Grab user location on mount ──
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setUserLocation(coords);
        // If no pickup set yet, use current location as pickup
        if (!pickup) setPickup(coords);
      } catch {
        // Location unavailable — search will work without bias
      }
    })();
  }, []);

  const handleSearch = useCallback(
    async (text: string, field: ActiveField) => {
      if (field === "pickup") setPickupText(text);
      else setDestinationText(text);

      if (text.trim().length < 2) {
        setResults([]);
        return;
      }

      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(async () => {
        setSearching(true);
        try {
          const data = await searchPlacesWithLocation(
            text,
            userLocation?.latitude,
            userLocation?.longitude,
          );
          setResults(data);
        } catch {
          setResults([]);
        } finally {
          setSearching(false);
        }
      }, 400);
    },
    [userLocation],
  );

  const handleSelectPlace = async (place: PlaceResult) => {
    Keyboard.dismiss();
    setResults([]);
    setSearching(true);

    try {
      const details = await getPlaceDetails(
        place.placeId,
        place.lat,
        place.lng,
      );

      // If address came back empty (Nominatim shortcut), use the display name
      const address = details.address || place.description;

      if (activeField === "pickup") {
        setPickup({ ...details, address } as any);
        setPickupText(place.mainText || place.description);
        setPickupLocked(false);
        setActiveField("destination");
        destinationRef.current?.focus();
      } else {
        setDestination({ ...details, address } as any);
        setDestinationText(place.mainText || place.description);
        setTimeout(() => router.push("/(user)/ride-options"), 300);
      }
    } catch (err) {
      console.warn("Could not get place details:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setPickupText("Current Location");
    setPickupLocked(true);
    if (userLocation) setPickup(userLocation);
    setActiveField("destination");
    destinationRef.current?.focus();
  };

  const canProceed = destinationText.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Where to?</Text>
      </View>

      {/* Input card */}
      <View style={styles.inputCard}>
        {/* Pickup */}
        <View style={styles.inputRow}>
          <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>From</Text>
            {pickupLocked ? (
              <TouchableOpacity
                onPress={() => {
                  setPickupLocked(false);
                  setActiveField("pickup");
                  setPickupText("");
                }}
              >
                <Text style={styles.lockedText}>
                  <Ionicons name="locate" size={13} color={COLORS.primary} />{" "}
                  Current Location
                </Text>
              </TouchableOpacity>
            ) : (
              <TextInput
                style={styles.textInput}
                placeholder="Enter pickup location"
                placeholderTextColor="#BBB"
                value={pickupText}
                onChangeText={(t) => handleSearch(t, "pickup")}
                onFocus={() => setActiveField("pickup")}
                autoFocus={!pickupLocked}
              />
            )}
          </View>
          {!pickupLocked && (
            <TouchableOpacity onPress={handleUseCurrentLocation}>
              <Ionicons
                name="locate-outline"
                size={18}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputDivider} />

        {/* Destination */}
        <View style={styles.inputRow}>
          <View style={[styles.dot, { backgroundColor: "#111" }]} />
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>To</Text>
            <TextInput
              ref={destinationRef}
              style={styles.textInput}
              placeholder="Search destination..."
              placeholderTextColor="#BBB"
              value={destinationText}
              onChangeText={(t) => handleSearch(t, "destination")}
              onFocus={() => setActiveField("destination")}
              autoFocus={pickupLocked}
            />
          </View>
          {destinationText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setDestinationText("");
                setResults([]);
              }}
            >
              <Ionicons name="close-circle" size={18} color="#CCC" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading */}
      {searching && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      )}

      {/* Search results */}
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.placeId}
          keyboardShouldPersistTaps="handled"
          style={styles.resultsList}
          contentContainerStyle={{ paddingHorizontal: SPACING.lg }}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 40).duration(300)}
            >
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectPlace(item)}
              >
                <View style={styles.resultIcon}>
                  <Ionicons name="location" size={16} color={COLORS.primary} />
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName} numberOfLines={1}>
                    {item.mainText || item.description}
                  </Text>
                  <Text style={styles.resultAddress} numberOfLines={1}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}

      {/* Quick destinations — show when no results and not loading */}
      {results.length === 0 && !searching && (
        <View style={styles.quickSection}>
          <Text style={styles.sectionLabel}>Nearby Popular</Text>
          <Text style={styles.sectionHint}>
            {userLocation
              ? "Based on your current location"
              : "Enable location for better results"}
          </Text>

          {canProceed && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <TouchableOpacity
                style={styles.proceedBtn}
                onPress={() => router.push("/(user)/ride-options")}
              >
                <Text style={styles.proceedText}>Find Rides →</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.lg,
    paddingBottom: SPACING.sm,
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

  inputCard: {
    marginHorizontal: SPACING.lg,
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    minHeight: 48,
  },
  dot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  inputWrap: { flex: 1 },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  textInput: {
    fontSize: 15,
    color: "#111",
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  lockedText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "600",
    paddingVertical: 4,
  },
  inputDivider: {
    height: 1,
    backgroundColor: "#EAEAEA",
    marginVertical: SPACING.xs,
    marginLeft: 18,
  },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  loadingText: { fontSize: 13, color: "#999" },

  resultsList: { flex: 1 },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
  },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 14, fontWeight: "600", color: "#111" },
  resultAddress: { fontSize: 12, color: "#888", marginTop: 2 },

  quickSection: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 12,
    color: "#BBB",
    marginBottom: SPACING.md,
  },
  proceedBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
    marginTop: SPACING.sm,
  },
  proceedText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

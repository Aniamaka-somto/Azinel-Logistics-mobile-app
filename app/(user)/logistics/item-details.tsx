import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import {
  useLogisticsStore,
  ItemCategory,
} from "../../../store/useLogisticsStore";

const CATEGORIES: {
  id: ItemCategory;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    id: "document",
    label: "Document",
    icon: "document-text-outline",
    desc: "Letters, files, contracts",
  },
  {
    id: "small_parcel",
    label: "Small Parcel",
    icon: "cube-outline",
    desc: "Fits in a backpack",
  },
  {
    id: "large_parcel",
    label: "Large Parcel",
    icon: "archive-outline",
    desc: "Box or larger bag",
  },
  {
    id: "fragile",
    label: "Fragile",
    icon: "wine-outline",
    desc: "Handle with care",
  },
  {
    id: "electronics",
    label: "Electronics",
    icon: "phone-portrait-outline",
    desc: "Phones, laptops, gadgets",
  },
];

const WEIGHTS = [0.5, 1, 2, 5, 10, 20];

export default function ItemDetails() {
  const { item, setItemCategory, setItemWeight, setItemDescription } =
    useLogisticsStore();

  const canProceed =
    item.category && item.weight && item.description.trim().length > 2;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Item Details</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Category */}
        <Text style={styles.sectionLabel}>Item Category</Text>
        {CATEGORIES.map((cat, i) => {
          const isActive = item.category === cat.id;
          return (
            <Animated.View
              key={cat.id}
              entering={FadeInDown.delay(i * 60).duration(400)}
            >
              <TouchableOpacity
                style={[styles.catCard, isActive && styles.catCardActive]}
                onPress={() => setItemCategory(cat.id)}
                activeOpacity={0.85}
              >
                <View
                  style={[styles.catIcon, isActive && styles.catIconActive]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={22}
                    color={isActive ? COLORS.primary : "#999"}
                  />
                </View>
                <View style={styles.catInfo}>
                  <Text
                    style={[
                      styles.catLabel,
                      isActive && { color: COLORS.primary },
                    ]}
                  >
                    {cat.label}
                  </Text>
                  <Text style={styles.catDesc}>{cat.desc}</Text>
                </View>
                {isActive && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Weight */}
        <Text style={styles.sectionLabel}>Approximate Weight (kg)</Text>
        <View style={styles.weightGrid}>
          {WEIGHTS.map((w, i) => {
            const isActive = item.weight === w;
            return (
              <Animated.View
                key={w}
                entering={FadeInDown.delay(i * 50)}
                style={styles.weightItem}
              >
                <TouchableOpacity
                  style={[
                    styles.weightChip,
                    isActive && styles.weightChipActive,
                  ]}
                  onPress={() => setItemWeight(w)}
                >
                  <Text
                    style={[
                      styles.weightText,
                      isActive && styles.weightTextActive,
                    ]}
                  >
                    {w} kg
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>Brief Description</Text>
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Black laptop bag, very important documents..."
            placeholderTextColor="#BBB"
            multiline
            numberOfLines={4}
            value={item.description}
            onChangeText={setItemDescription}
          />
        </Animated.View>

        {/* Weight note */}
        <View style={styles.note}>
          <Ionicons name="alert-circle-outline" size={16} color="#F59E0B" />
          <Text style={styles.noteText}>
            Pricing is based on weight + distance. Final price shown at
            confirmation.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.proceedBtn, !canProceed && styles.proceedDisabled]}
        onPress={() => router.push("/(user)/logistics/receiver")}
        disabled={!canProceed}
      >
        <Text style={styles.proceedText}>Receiver Details →</Text>
      </TouchableOpacity>
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
  scroll: { padding: SPACING.lg, paddingBottom: 100 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
  },

  catCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
  },
  catCardActive: { borderColor: COLORS.primary, backgroundColor: "#FFF5F6" },
  catIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  catIconActive: { backgroundColor: "#FFE8EA" },
  catInfo: { flex: 1 },
  catLabel: { fontSize: 15, fontWeight: "700", color: "#111" },
  catDesc: { fontSize: 12, color: "#888", marginTop: 2 },

  weightGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  weightItem: { width: "30%" },
  weightChip: {
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
    alignItems: "center",
  },
  weightChipActive: { borderColor: COLORS.primary, backgroundColor: "#FFF5F6" },
  weightText: { fontSize: 13, fontWeight: "500", color: "#555" },
  weightTextActive: { color: COLORS.primary, fontWeight: "700" },

  textArea: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    fontSize: 14,
    color: "#111",
    textAlignVertical: "top",
    minHeight: 100,
  },

  note: {
    flexDirection: "row",
    gap: SPACING.sm,
    backgroundColor: "#FFFBEB",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: SPACING.md,
    marginTop: SPACING.md,
    alignItems: "flex-start",
  },
  noteText: { flex: 1, fontSize: 12, color: "#92400E", lineHeight: 18 },

  proceedBtn: {
    backgroundColor: COLORS.primary,
    margin: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  proceedDisabled: { opacity: 0.45 },
  proceedText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

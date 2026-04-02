import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import { useLogisticsStore } from "../../../store/useLogisticsStore";
import Input from "../../../components/Input";

export default function ReceiverDetails() {
  const { receiver, setReceiver } = useLogisticsStore();

  const canProceed =
    receiver.name.trim().length > 1 && receiver.phone.trim().length >= 10;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Receiver Details</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Receiver card */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons
              name="person-circle-outline"
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.cardTitle}>Who is receiving this?</Text>
          </View>

          <Text style={styles.fieldLabel}>Full Name</Text>
          <Input
            placeholder="e.g. Chidi Okeke"
            value={receiver.name}
            onChangeText={(text) => setReceiver({ ...receiver, name: text })}
          />

          <View style={{ height: SPACING.md }} />

          <Text style={styles.fieldLabel}>Phone Number</Text>
          <Input
            placeholder="e.g. 08012345678"
            value={receiver.phone}
            onChangeText={(text) => setReceiver({ ...receiver, phone: text })}
            keyboardType="phone-pad"
          />
        </Animated.View>

        {/* Note */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.note}
        >
          <Ionicons name="call-outline" size={16} color={COLORS.primary} />
          <Text style={styles.noteText}>
            Our rider will contact the receiver before delivery. Make sure the
            number is active.
          </Text>
        </Animated.View>

        {/* Privacy note */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={styles.privacy}
        >
          <Ionicons name="shield-checkmark-outline" size={16} color="#22C55E" />
          <Text style={styles.privacyText}>
            Receiver info is only shared with your assigned rider.
          </Text>
        </Animated.View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.proceedBtn, !canProceed && styles.proceedDisabled]}
        onPress={() => router.push("/(user)/logistics/confirm")}
        disabled={!canProceed}
      >
        <Text style={styles.proceedText}>Review & Confirm →</Text>
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
  scroll: { padding: SPACING.lg, paddingBottom: 100, gap: SPACING.md },

  card: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#111" },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },

  note: {
    flexDirection: "row",
    gap: SPACING.sm,
    backgroundColor: "#FFF5F6",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#FFD6DA",
    padding: SPACING.md,
    alignItems: "flex-start",
  },
  noteText: { flex: 1, fontSize: 13, color: "#555", lineHeight: 20 },

  privacy: {
    flexDirection: "row",
    gap: SPACING.sm,
    backgroundColor: "#F0FDF4",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: SPACING.md,
    alignItems: "center",
  },
  privacyText: { flex: 1, fontSize: 13, color: "#166534" },

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

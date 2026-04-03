import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";

const PERIODS = ["Today", "This Week", "This Month"];

const TRANSACTIONS = [
  {
    id: "1",
    passenger: "Amaka O.",
    from: "Ring Road",
    to: "UNIBEN",
    amount: 1500,
    time: "10:32 AM",
    date: "Today",
  },
  {
    id: "2",
    passenger: "Chukwudi E.",
    from: "Airport",
    to: "GRA",
    amount: 3500,
    time: "8:15 AM",
    date: "Today",
  },
  {
    id: "3",
    passenger: "Fatima M.",
    from: "Oba Market",
    to: "Ugbowo",
    amount: 1800,
    time: "Yesterday",
    date: "Yesterday",
  },
  {
    id: "4",
    passenger: "Tunde A.",
    from: "Sapele Rd",
    to: "New Benin",
    amount: 1200,
    time: "Yesterday",
    date: "Yesterday",
  },
  {
    id: "5",
    passenger: "Grace I.",
    from: "GRA",
    to: "Ring Road",
    amount: 2000,
    time: "Mon",
    date: "Monday",
  },
];

const STATS = [
  { label: "Total Trips", value: "142", icon: "car-outline" },
  { label: "Rating", value: "4.91", icon: "star-outline" },
  { label: "Acceptance", value: "94%", icon: "checkmark-circle-outline" },
];

export default function Earnings() {
  const [activePeriod, setActivePeriod] = useState("Today");

  const periodEarnings: Record<string, number> = {
    Today: 5000,
    "This Week": 28500,
    "This Month": 112000,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Earnings</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Period selector */}
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.periodChip,
                activePeriod === p && styles.periodChipActive,
              ]}
              onPress={() => setActivePeriod(p)}
            >
              <Text
                style={[
                  styles.periodText,
                  activePeriod === p && styles.periodTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main earnings card */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.earningsCard}
        >
          <Text style={styles.earningsLabel}>
            {activePeriod === "Today"
              ? "Today's Earnings"
              : activePeriod === "This Week"
                ? "This Week"
                : "This Month"}
          </Text>
          <Text style={styles.earningsAmount}>
            ₦{periodEarnings[activePeriod].toLocaleString()}
          </Text>

          <View style={styles.earningsMeta}>
            <View style={styles.earningsMetaItem}>
              <Ionicons name="car" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.earningsMetaText}>
                {activePeriod === "Today"
                  ? "3"
                  : activePeriod === "This Week"
                    ? "19"
                    : "74"}{" "}
                trips
              </Text>
            </View>
            <View style={styles.earningsMetaItem}>
              <Ionicons name="time" size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.earningsMetaText}>
                {activePeriod === "Today"
                  ? "4.5h"
                  : activePeriod === "This Week"
                    ? "31h"
                    : "118h"}{" "}
                online
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map((stat, i) => (
            <Animated.View
              key={stat.label}
              entering={FadeInDown.delay(i * 80).duration(400)}
              style={styles.statCard}
            >
              <Ionicons
                name={stat.icon as any}
                size={18}
                color={COLORS.primary}
              />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Animated.View>
          ))}
        </View>

        {/* Payout button */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <TouchableOpacity style={styles.payoutBtn}>
            <Ionicons name="wallet-outline" size={18} color="#fff" />
            <Text style={styles.payoutText}>Request Payout</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Transactions */}
        <Text style={styles.sectionLabel}>Recent Trips</Text>

        {TRANSACTIONS.map((tx, i) => (
          <Animated.View
            key={tx.id}
            entering={FadeInDown.delay(i * 60).duration(400)}
            style={styles.txCard}
          >
            <View style={styles.txIcon}>
              <Ionicons name="car" size={18} color={COLORS.primary} />
            </View>

            <View style={styles.txInfo}>
              <Text style={styles.txPassenger}>{tx.passenger}</Text>
              <Text style={styles.txRoute} numberOfLines={1}>
                {tx.from} → {tx.to}
              </Text>
              <Text style={styles.txTime}>{tx.time}</Text>
            </View>

            <Text style={styles.txAmount}>+₦{tx.amount.toLocaleString()}</Text>
          </Animated.View>
        ))}

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.lg,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginVertical: SPACING.lg,
  },

  periodRow: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.md,
  },
  periodChip: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: "center",
  },
  periodChipActive: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  periodText: { fontSize: 13, fontWeight: "500", color: "#999" },
  periodTextActive: { color: COLORS.primary, fontWeight: "700" },

  earningsCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  earningsLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
  },
  earningsAmount: {
    fontSize: 38,
    fontWeight: "800",
    color: "#fff",
    marginBottom: SPACING.md,
  },
  earningsMeta: { flexDirection: "row", gap: SPACING.md },
  earningsMetaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  earningsMetaText: { fontSize: 13, color: "rgba(255,255,255,0.85)" },

  statsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 17, fontWeight: "800", color: "#111" },
  statLabel: { fontSize: 11, color: "#999", textAlign: "center" },

  payoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  payoutText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },

  txCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: SPACING.sm,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
  },
  txInfo: { flex: 1 },
  txPassenger: { fontWeight: "700", color: "#111", fontSize: 14 },
  txRoute: { fontSize: 12, color: "#888", marginTop: 2 },
  txTime: { fontSize: 11, color: "#BBB", marginTop: 2 },
  txAmount: { fontWeight: "800", color: "#22C55E", fontSize: 15 },
});

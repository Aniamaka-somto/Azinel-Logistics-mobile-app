import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";

type PaymentMethod = {
  id: string;
  type: "card" | "bank" | "wallet";
  label: string;
  subLabel: string;
  icon: string;
  isDefault: boolean;
};

const INITIAL_METHODS: PaymentMethod[] = [
  {
    id: "1",
    type: "wallet",
    label: "Azinel Wallet",
    subLabel: "Balance: ₦5,000",
    icon: "wallet-outline",
    isDefault: true,
  },
  {
    id: "2",
    type: "card",
    label: "Mastercard",
    subLabel: "···· ···· ···· 4521",
    icon: "card-outline",
    isDefault: false,
  },
  {
    id: "3",
    type: "bank",
    label: "GTBank",
    subLabel: "···· 7823",
    icon: "business-outline",
    isDefault: false,
  },
];

const PAYMENT_ICONS: Record<string, string> = {
  card: "card-outline",
  bank: "business-outline",
  wallet: "wallet-outline",
};

const HISTORY = [
  {
    id: "1",
    label: "Ride to UNIBEN",
    amount: -1500,
    date: "Today, 10:32 AM",
    status: "success",
  },
  {
    id: "2",
    label: "Wallet Top-up",
    amount: 5000,
    date: "Yesterday, 3:15 PM",
    status: "success",
  },
  {
    id: "3",
    label: "Intercity — Benin to Lagos",
    amount: -28000,
    date: "Mon, 8:00 AM",
    status: "success",
  },
  {
    id: "4",
    label: "Logistics Delivery",
    amount: -3000,
    date: "Sun, 2:00 PM",
    status: "success",
  },
];

export default function PaymentMethods() {
  const [methods, setMethods] = useState(INITIAL_METHODS);
  const [activeTab, setActiveTab] = useState<"methods" | "history">("methods");

  const setDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  const removeMethod = (id: string) => {
    const method = methods.find((m) => m.id === id);
    if (method?.isDefault) {
      Alert.alert("Cannot remove", "Set another method as default first.");
      return;
    }
    Alert.alert("Remove Payment Method", `Remove ${method?.label}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setMethods((prev) => prev.filter((m) => m.id !== id)),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
      </View>

      {/* Wallet balance card */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={styles.walletCard}
      >
        <View style={styles.walletTop}>
          <View>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletAmount}>₦5,000.00</Text>
          </View>
          <View style={styles.walletIconWrap}>
            <Ionicons name="wallet" size={28} color="#fff" />
          </View>
        </View>
        <TouchableOpacity style={styles.topUpBtn}>
          <Ionicons name="add-circle-outline" size={16} color="#fff" />
          <Text style={styles.topUpText}>Top Up Wallet</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["methods", "history"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab === "methods" ? "Payment Methods" : "History"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {activeTab === "methods" ? (
          <>
            {methods.map((method, i) => (
              <Animated.View
                key={method.id}
                entering={FadeInDown.delay(i * 80).duration(400)}
                style={styles.methodCard}
              >
                <View
                  style={[
                    styles.methodIcon,
                    method.type === "wallet" && styles.walletMethodIcon,
                  ]}
                >
                  <Ionicons
                    name={method.icon as any}
                    size={22}
                    color={method.type === "wallet" ? "#fff" : COLORS.primary}
                  />
                </View>

                <View style={styles.methodInfo}>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                  <Text style={styles.methodSub}>{method.subLabel}</Text>
                </View>

                <View style={styles.methodActions}>
                  {method.isDefault ? (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.setDefaultBtn}
                      onPress={() => setDefault(method.id)}
                    >
                      <Text style={styles.setDefaultText}>Set default</Text>
                    </TouchableOpacity>
                  )}
                  {method.type !== "wallet" && (
                    <TouchableOpacity
                      onPress={() => removeMethod(method.id)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons name="trash-outline" size={18} color="#CCC" />
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            ))}

            {/* Add new */}
            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
              <Text style={styles.sectionLabel}>Add New</Text>
              <View style={styles.addGrid}>
                {[
                  { label: "Add Card", icon: "card-outline" },
                  { label: "Add Bank", icon: "business-outline" },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.label}
                    style={styles.addBtn}
                    onPress={() =>
                      Alert.alert(
                        "Coming Soon",
                        "Payment gateway integration coming soon.",
                      )
                    }
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={COLORS.primary}
                    />
                    <Text style={styles.addBtnText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

            {/* Note */}
            <View style={styles.note}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color="#22C55E"
              />
              <Text style={styles.noteText}>
                Your payment info is encrypted and secure. We never store full
                card details.
              </Text>
            </View>
          </>
        ) : (
          <>
            {HISTORY.map((tx, i) => (
              <Animated.View
                key={tx.id}
                entering={FadeInDown.delay(i * 60).duration(400)}
                style={styles.txCard}
              >
                <View
                  style={[styles.txIcon, tx.amount > 0 && styles.txIconCredit]}
                >
                  <Ionicons
                    name={tx.amount > 0 ? "arrow-down" : "arrow-up"}
                    size={18}
                    color={tx.amount > 0 ? "#22C55E" : COLORS.primary}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txLabel}>{tx.label}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    tx.amount > 0 && styles.txAmountCredit,
                  ]}
                >
                  {tx.amount > 0 ? "+" : ""}₦
                  {Math.abs(tx.amount).toLocaleString()}
                </Text>
              </Animated.View>
            ))}
          </>
        )}

        <View style={{ height: SPACING.xl }} />
      </ScrollView>
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

  walletCard: {
    margin: SPACING.lg,
    marginTop: 0,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  walletTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  walletLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginBottom: 4,
  },
  walletAmount: { fontSize: 30, fontWeight: "900", color: "#fff" },
  walletIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  topUpBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  topUpText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    padding: 4,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tabText: { fontSize: 13, fontWeight: "500", color: "#999" },
  tabTextActive: { color: COLORS.primary, fontWeight: "700" },

  scroll: { flex: 1, paddingHorizontal: SPACING.lg },

  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
    marginBottom: SPACING.sm,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
  },
  walletMethodIcon: { backgroundColor: COLORS.primary },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 14, fontWeight: "700", color: "#111" },
  methodSub: { fontSize: 12, color: "#888", marginTop: 2 },
  methodActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  defaultBadge: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  defaultBadgeText: { fontSize: 11, fontWeight: "700", color: "#166534" },
  setDefaultBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  setDefaultText: { fontSize: 11, fontWeight: "600", color: "#666" },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  addGrid: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md },
  addBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    borderStyle: "dashed",
    backgroundColor: "#FAFAFA",
  },
  addBtnText: { fontSize: 14, fontWeight: "600", color: COLORS.primary },

  note: {
    flexDirection: "row",
    gap: SPACING.sm,
    backgroundColor: "#F0FDF4",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: "flex-start",
  },
  noteText: { flex: 1, fontSize: 12, color: "#166534", lineHeight: 18 },

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
  txIconCredit: { backgroundColor: "#F0FDF4" },
  txInfo: { flex: 1 },
  txLabel: { fontSize: 14, fontWeight: "600", color: "#111" },
  txDate: { fontSize: 12, color: "#888", marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: "800", color: COLORS.primary },
  txAmountCredit: { color: "#22C55E" },
});

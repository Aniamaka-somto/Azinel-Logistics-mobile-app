import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const CARDS = [
  { id: "1", type: "Visa", last4: "4242", expiry: "08/26", isDefault: true },
  {
    id: "2",
    type: "Mastercard",
    last4: "1234",
    expiry: "12/25",
    isDefault: false,
  },
];

export default function PaymentMethods() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Payment Methods</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Wallet balance */}
        <View style={styles.walletCard}>
          <View>
            <Text style={styles.walletLabel}>Azinel Wallet</Text>
            <Text style={styles.walletBalance}>₦ 5,400.00</Text>
          </View>
          <TouchableOpacity style={styles.topUpBtn}>
            <Text style={styles.topUpText}>Top Up</Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        <Text style={styles.sectionLabel}>Saved Cards</Text>
        {CARDS.map((card) => (
          <View key={card.id} style={styles.cardRow}>
            <View style={styles.cardIcon}>
              <Ionicons name="card" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardType}>
                {card.type} ···· {card.last4}
                {card.isDefault && (
                  <Text style={styles.defaultBadge}> Default</Text>
                )}
              </Text>
              <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="trash-outline" size={18} color="#CCC" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Add new */}
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons
            name="add-circle-outline"
            size={20}
            color={COLORS.primary}
          />
          <Text style={styles.addText}>Add New Card</Text>
        </TouchableOpacity>

        {/* Note */}
        <View style={styles.noteRow}>
          <Ionicons name="lock-closed-outline" size={14} color="#999" />
          <Text style={styles.noteText}>
            Payments are secured and encrypted
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 17, fontWeight: "700", color: "#111" },
  content: { padding: SPACING.lg, gap: SPACING.md },

  walletCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.sm,
  },
  walletLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  walletBalance: { fontSize: 28, fontWeight: "800", color: "#fff" },
  topUpBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  topUpText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.sm,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: { flex: 1 },
  cardType: { fontSize: 14, fontWeight: "600", color: "#111" },
  defaultBadge: { fontSize: 11, color: COLORS.primary, fontWeight: "700" },
  cardExpiry: { fontSize: 12, color: "#999", marginTop: 2 },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
  },
  addText: { color: COLORS.primary, fontWeight: "600", fontSize: 14 },

  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  noteText: { fontSize: 12, color: "#999" },
});

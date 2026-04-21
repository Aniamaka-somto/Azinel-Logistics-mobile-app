import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";

import { COLORS, SPACING, RADIUS } from "../../constants/theme";

const FAQS = [
  {
    q: "How do I book a ride?",
    a: "Tap 'Where to?' on the home screen, enter your destination, choose a ride class and confirm. A driver will be assigned shortly.",
  },
  {
    q: "How do I cancel a ride?",
    a: "You can cancel a ride before the driver arrives by tapping 'Cancel Ride' on the active trip screen. Note that repeated cancellations may affect your account.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We currently accept cash payments. Card and wallet payments are coming soon.",
  },
  {
    q: "How does intercity work?",
    a: "Select Intercity from the home screen, choose your origin and destination cities, pick an area, set your departure date and time, then choose Sedan or SUV.",
  },
  {
    q: "How do I send a package?",
    a: "Select Logistics from the home screen, enter pickup and delivery addresses, add item details and receiver info, then confirm.",
  },
  {
    q: "My driver hasn't arrived. What do I do?",
    a: "You can call or message your driver directly from the active trip screen. If the issue persists, cancel and rebook.",
  },
  {
    q: "How do I rate my trip?",
    a: "After every completed trip, you'll be prompted to rate your driver from 1 to 5 stars. You can also add a tip and written feedback.",
  },
  {
    q: "Is my location data safe?",
    a: "Yes. Location is only used to match you with drivers and track your trip. We never sell your data to third parties.",
  },
];

const CONTACT_OPTIONS = [
  {
    label: "Call Support",
    sub: "Mon–Fri, 8AM–8PM",
    icon: "call-outline",
    color: "#22C55E",
    bg: "#F0FDF4",
    action: () => Linking.openURL("tel:+2348000000000"),
  },
  {
    label: "Email Us",
    sub: "support@azinel.com",
    icon: "mail-outline",
    color: "#6366F1",
    bg: "#EEF2FF",
    action: () => Linking.openURL("mailto:support@azinel.com"),
  },
  {
    label: "Live Chat",
    sub: "Typically replies in 5 mins",
    icon: "chatbubble-outline",
    color: COLORS.primary,
    bg: "#FFF5F6",
    action: () => Alert.alert("Coming Soon", "Live chat is coming soon."),
  },
];

export default function HelpSupport() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"faq" | "contact">("faq");

  const filtered = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      {/* Emergency SOS */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.sosCard}>
        <View style={styles.sosLeft}>
          <Ionicons name="warning" size={22} color="#fff" />
          <View>
            <Text style={styles.sosTitle}>Emergency SOS</Text>
            <Text style={styles.sosSub}>
              Call emergency services immediately
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.sosBtn}
          onPress={() =>
            Alert.alert(
              "Call Emergency?",
              "This will call 112 (Nigeria Emergency).",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Call Now",
                  style: "destructive",
                  onPress: () => Linking.openURL("tel:112"),
                },
              ],
            )
          }
        >
          <Text style={styles.sosBtnText}>Call 112</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["faq", "contact"] as const).map((tab) => (
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
              {tab === "faq" ? "FAQ" : "Contact Us"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {activeTab === "faq" ? (
          <>
            {/* Search */}
            <View style={styles.searchRow}>
              <Ionicons name="search-outline" size={16} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search help topics..."
                placeholderTextColor="#BBB"
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={16} color="#CCC" />
                </TouchableOpacity>
              )}
            </View>

            {filtered.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>
                  No results for &quot;{search}&quot;
                </Text>
              </View>
            ) : (
              filtered.map((faq, i) => (
                <Animated.View
                  key={i}
                  entering={FadeInDown.delay(i * 50).duration(400)}
                >
                  <TouchableOpacity
                    style={styles.faqCard}
                    onPress={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.faqHeader}>
                      <Text
                        style={styles.faqQ}
                        numberOfLines={expandedFaq === i ? undefined : 2}
                      >
                        {faq.q}
                      </Text>
                      <Ionicons
                        name={expandedFaq === i ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#999"
                      />
                    </View>
                    {expandedFaq === i && (
                      <Text style={styles.faqA}>{faq.a}</Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              ))
            )}
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>Get in touch</Text>
            {CONTACT_OPTIONS.map((opt, i) => (
              <Animated.View
                key={opt.label}
                entering={FadeInDown.delay(i * 80).duration(400)}
              >
                <TouchableOpacity
                  style={styles.contactCard}
                  onPress={opt.action}
                  activeOpacity={0.85}
                >
                  <View
                    style={[styles.contactIcon, { backgroundColor: opt.bg }]}
                  >
                    <Ionicons
                      name={opt.icon as any}
                      size={22}
                      color={opt.color}
                    />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>{opt.label}</Text>
                    <Text style={styles.contactSub}>{opt.sub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#CCC" />
                </TouchableOpacity>
              </Animated.View>
            ))}

            {/* Report lost item */}
            <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>
              Other Issues
            </Text>
            {[
              { label: "Report Lost Item", icon: "search-outline" },
              { label: "Report a Safety Issue", icon: "shield-outline" },
              { label: "Report Incorrect Charge", icon: "receipt-outline" },
            ].map((item, i) => (
              <Animated.View
                key={item.label}
                entering={FadeInDown.delay(i * 60).duration(400)}
              >
                <TouchableOpacity
                  style={styles.issueCard}
                  onPress={() =>
                    Alert.alert(
                      item.label,
                      "Please email support@azinel.com with your booking ID and details.",
                      [{ text: "OK" }],
                    )
                  }
                >
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.issueLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#CCC" />
                </TouchableOpacity>
              </Animated.View>
            ))}

            {/* App version */}
            <Text style={styles.versionText}>Azinel v1.0.0</Text>
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

  sosCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  sosLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
  },
  sosTitle: { fontSize: 14, fontWeight: "700", color: "#fff" },
  sosSub: { fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  sosBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  sosBtnText: { color: COLORS.primary, fontWeight: "800", fontSize: 13 },

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

  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.sm },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: "#F5F5F5",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111" },

  faqCard: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
    marginBottom: SPACING.sm,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  faqQ: { flex: 1, fontSize: 14, fontWeight: "600", color: "#111" },
  faqA: {
    fontSize: 13,
    color: "#666",
    lineHeight: 22,
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    backgroundColor: "#fff",
    marginBottom: SPACING.sm,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 15, fontWeight: "700", color: "#111" },
  contactSub: { fontSize: 12, color: "#888", marginTop: 2 },

  issueCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: SPACING.sm,
  },
  issueLabel: { flex: 1, fontSize: 14, color: "#333" },

  emptyWrap: { paddingVertical: 40, alignItems: "center" },
  emptyText: { fontSize: 14, color: "#BBB" },

  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#CCC",
    marginTop: SPACING.lg,
  },
});

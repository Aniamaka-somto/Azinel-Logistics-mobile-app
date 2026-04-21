import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
    q: "How do I go online and start accepting rides?",
    a: "Toggle the Online switch on your dashboard. Make sure your documents are verified and your location is enabled.",
  },
  {
    q: "How and when do I get paid?",
    a: "Earnings from completed trips are added to your wallet instantly. Payouts to your bank account are processed weekly every Monday.",
  },
  {
    q: "What happens if a passenger cancels?",
    a: "If a passenger cancels after you've started moving to pickup, you may be eligible for a cancellation fee.",
  },
  {
    q: "My document was rejected. What do I do?",
    a: "Go to Documents in your profile, check the rejection reason, then re-upload a clear, valid copy of the document.",
  },
  {
    q: "How is my rating calculated?",
    a: "Your rating is the average of all passenger ratings. Maintain above 4.5 to stay in good standing.",
  },
  {
    q: "What if a passenger is rude or unsafe?",
    a: "You can end the trip at any time. Use the Report button after the trip or contact support immediately.",
  },
];

export default function DriverHelp() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"faq" | "contact">("faq");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Help & Support</Text>
      </View>

      {/* Emergency */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.sosCard}>
        <View style={styles.sosLeft}>
          <Ionicons name="warning" size={22} color="#fff" />
          <View>
            <Text style={styles.sosTitle}>Emergency SOS</Text>
            <Text style={styles.sosSub}>For your safety on the road</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.sosBtn}
          onPress={() =>
            Alert.alert("Call Emergency?", "This will call 112.", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Call Now",
                style: "destructive",
                onPress: () => Linking.openURL("tel:112"),
              },
            ])
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
          FAQS.map((faq, i) => (
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
                  <Text style={styles.faqQ}>{faq.q}</Text>
                  <Ionicons
                    name={expandedFaq === i ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#999"
                  />
                </View>
                {expandedFaq === i && <Text style={styles.faqA}>{faq.a}</Text>}
              </TouchableOpacity>
            </Animated.View>
          ))
        ) : (
          <>
            {[
              {
                label: "Call Driver Support",
                sub: "Priority line for drivers",
                icon: "call-outline",
                color: "#22C55E",
                bg: "#F0FDF4",
                action: () => Linking.openURL("tel:+2348000000001"),
              },
              {
                label: "Email Support",
                sub: "drivers@azinel.com",
                icon: "mail-outline",
                color: "#6366F1",
                bg: "#EEF2FF",
                action: () => Linking.openURL("mailto:drivers@azinel.com"),
              },
              {
                label: "Report an Incident",
                sub: "Safety or passenger issues",
                icon: "flag-outline",
                color: COLORS.primary,
                bg: "#FFF5F6",
                action: () =>
                  Alert.alert(
                    "Report Incident",
                    "Email drivers@azinel.com with trip ID and details.",
                  ),
              },
            ].map((opt, i) => (
              <Animated.View
                key={opt.label}
                entering={FadeInDown.delay(i * 80).duration(400)}
              >
                <TouchableOpacity
                  style={styles.contactCard}
                  onPress={opt.action}
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

            <Text style={styles.versionText}>Azinel Driver v1.0.0</Text>
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

  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#CCC",
    marginTop: SPACING.lg,
  },
});

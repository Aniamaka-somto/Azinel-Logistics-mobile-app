import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";
import { router } from "expo-router";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";

const MENU_SECTIONS = [
  {
    title: "Vehicle",
    items: [
      {
        label: "My Vehicle",
        icon: "car-outline",
        value: "Toyota Corolla · KJA-234EG",
        route: null,
      },
      {
        label: "Documents",
        icon: "document-text-outline",
        value: "All verified",
        route: "/(driver)/documents",
      },
    ],
  },

  {
    title: "Payments",
    items: [
      {
        label: "Bank Account",
        icon: "business-outline",
        value: "GTBank ···4521",
      },
      { label: "Payout Schedule", icon: "calendar-outline", value: "Weekly" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Report an Issue", icon: "flag-outline" },
      { label: "Terms & Privacy", icon: "shield-outline" },
      {
        label: "Help Center",
        icon: "help-circle-outline",
        route: "/(driver)/help",
      },
      {
        label: "Notifications",
        icon: "notifications-outline",
        route: "/(driver)/notifications",
      },
    ],
  },
];

export default function DriverProfile() {
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Profile</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Driver card */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.driverCard}
        >
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Emmanuel Kalu</Text>
            <Text style={styles.driverSub}>Driver since Jan 2024</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.rating}>4.91</Text>
              <Text style={styles.ratingCount}>· 142 trips</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil-outline" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Verification badges */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.badgesRow}
        >
          {[
            { label: "ID Verified", icon: "shield-checkmark" },
            { label: "Licensed", icon: "ribbon" },
            { label: "Insured", icon: "car" },
          ].map((badge) => (
            <View key={badge.label} style={styles.badge}>
              <Ionicons name={badge.icon as any} size={16} color="#22C55E" />
              <Text style={styles.badgeText}>{badge.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Notifications toggles */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionLabel}>Preferences</Text>
          <View style={styles.menuCard}>
            <View style={styles.toggleRow}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.toggleLabel}>Ride Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#E0E0E0", true: "#FFD6DA" }}
                thumbColor={notifications ? COLORS.primary : "#BDBDBD"}
              />
            </View>
            <View style={styles.menuDivider} />
            <View style={styles.toggleRow}>
              <Ionicons
                name="volume-high-outline"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.toggleLabel}>Sound Alerts</Text>
              <Switch
                value={soundAlerts}
                onValueChange={setSoundAlerts}
                trackColor={{ false: "#E0E0E0", true: "#FFD6DA" }}
                thumbColor={soundAlerts ? COLORS.primary : "#BDBDBD"}
              />
            </View>
          </View>
        </Animated.View>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section, si) => (
          <Animated.View
            key={section.title}
            entering={FadeInDown.delay((si + 2) * 80).duration(400)}
            style={styles.section}
          >
            <Text style={styles.sectionLabel}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, ii) => (
                <View key={item.label}>
                  <TouchableOpacity
                    key={item.label}
                    style={styles.menuItem}
                    onPress={() =>
                      "route" in item &&
                      item.route &&
                      router.push(item.route as any)
                    }
                  >
                    <View style={styles.menuIcon}>
                      <Ionicons
                        name={item.icon as any}
                        size={18}
                        color={COLORS.primary}
                      />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <View style={styles.menuRight}>
                      {"value" in item && (
                        <Text style={styles.menuValue}>{item.value}</Text>
                      )}
                      <Ionicons name="chevron-forward" size={16} color="#CCC" />
                    </View>
                  </TouchableOpacity>
                  {ii < section.items.length - 1 && (
                    <View style={styles.menuDivider} />
                  )}
                </View>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>

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

  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: "#FFF5F6",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#FFD6DA",
    marginBottom: SPACING.md,
  },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#fff",
  },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 17, fontWeight: "700", color: "#111" },
  driverSub: { fontSize: 12, color: "#888", marginTop: 2 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  rating: { fontSize: 13, fontWeight: "700", color: "#111" },
  ratingCount: { fontSize: 13, color: "#888" },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD6DA",
  },

  badgesRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  badge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: SPACING.sm,
    backgroundColor: "#F0FDF4",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#166534",
    flexShrink: 1,
  },

  section: { marginBottom: SPACING.md },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },
  menuCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: { flex: 1, fontSize: 14, color: "#222" },
  menuRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuValue: { fontSize: 12, color: "#999" },
  menuDivider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: SPACING.md,
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  toggleLabel: { flex: 1, fontSize: 14, color: "#222" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginBottom: SPACING.md,
  },
  logoutText: { color: COLORS.primary, fontWeight: "600", fontSize: 15 },
});

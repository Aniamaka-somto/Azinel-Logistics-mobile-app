import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";
import { router } from "expo-router";

const MENU_ITEMS = [
  { label: "Payment Methods", icon: "card-outline", route: "/(user)/payment/" },
  {
    label: "Ride History",
    icon: "time-outline",
    route: "/(user)/(tabs)/rides",
  },
  {
    label: "Notifications",
    icon: "notifications-outline",
    route: "/(user)/notifications",
  },
  {
    label: "Help & Support",
    icon: "help-circle-outline",
    route: "/(user)/help",
  },
  {
    label: "Help & Support",
    icon: "help-circle-outline",
    route: "/(user)/help",
  },
  { label: "Settings", icon: "settings-outline", route: null },
];

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Profile</Text>

        {/* Avatar card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={36} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.email}>john@example.com</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.rating}>4.9 · 42 rides</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => item.route && router.push(item.route as any)}
            >
              <View style={styles.menuIcon}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginVertical: SPACING.lg,
  },
  avatarCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: "#FFF5F6",
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: "#FFD6DA",
  },
  avatarCircle: {
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
  name: { fontSize: 17, fontWeight: "700", color: "#111" },
  email: { fontSize: 13, color: "#666", marginTop: 2 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  rating: { fontSize: 13, color: "#555" },

  menu: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    overflow: "hidden",
    marginBottom: SPACING.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    gap: SPACING.sm,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: { flex: 1, fontSize: 15, color: "#222" },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  logoutText: { color: COLORS.primary, fontWeight: "600", fontSize: 15 },
});

import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}></View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=11" }}
            style={styles.avatar}
          />
          <View style={styles.editBadge}>
            <Ionicons name="create" size={14} color="#fff" />
          </View>
        </View>
        <Text style={styles.name}>OLUWATOBI AZINEL</Text>
        <Text style={styles.memberStatus}>ELITE MEMBER • SINCE 2022</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>28</Text>
          <Text style={styles.statLabel}>TRIPS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>SHIPMENTS</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>₦340k</Text>
          <Text style={styles.statLabel}>SAVED</Text>
        </View>
      </View>

      {/* Menu Sections */}
      <MenuSection title="ACCOUNT">
        <MenuItem icon="person-outline" label="Personal Information" />
        <MenuItem icon="card-outline" label="Payment Methods" />
      </MenuSection>

      <MenuSection title="PREFERENCES">
        <MenuItem icon="notifications-outline" label="Notifications" />
        <MenuItem icon="moon-outline" label="Display & Theme" />
      </MenuSection>

      <MenuSection title="SAFETY">
        <MenuItem icon="shield-checkmark-outline" label="Security Center" />
        <MenuItem icon="location-sharing" label="Trusted Contacts" />
      </MenuSection>

      <MenuSection title="SUPPORT & LEGAL">
        <MenuItem icon="help-circle-outline" label="Help Center" />
        <MenuItem icon="document-text-outline" label="Terms of Service" />
      </MenuSection>

      <TouchableOpacity style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={20} color="#E53935" />
        <Text style={styles.logoutText}>LOG OUT</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteBtn}>
        <Text style={styles.deleteText}>DELETE ACCOUNT</Text>
      </TouchableOpacity>

      <Text style={styles.version}>VERSION 4.12.0 • BUILD KINETIC</Text>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const MenuSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.menuSection}>
    <Text style={styles.menuTitle}>{title}</Text>
    <View style={styles.menuItems}>{children}</View>
  </View>
);

const MenuItem = ({ icon, label }: { icon: string; label: string }) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuLeft}>
      <Ionicons name={icon as any} size={20} color="#B0B0B0" />
      <Text style={styles.menuLabel}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#3A3A3A" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  logo: { color: "#E53935", fontSize: 20, fontWeight: "900" },
  profileImg: { width: 36, height: 36, borderRadius: 18 },
  profileSection: { alignItems: "center", marginTop: 20, marginBottom: 30 },
  avatarContainer: { position: "relative", marginBottom: 16 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#E53935",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#E53935",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  name: { color: "#fff", fontSize: 24, fontWeight: "900", letterSpacing: 1 },
  memberStatus: {
    color: "#B0B0B0",
    fontSize: 12,
    marginTop: 6,
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statBox: {
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    width: "30%",
  },
  statValue: { color: "#fff", fontSize: 18, fontWeight: "700" },
  statLabel: { color: "#B0B0B0", fontSize: 10, marginTop: 4 },
  menuSection: { marginBottom: 24 },
  menuTitle: {
    color: "#3A3A3A",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 8,
  },
  menuItems: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: 20,
    borderRadius: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuLabel: { color: "#B0B0B0", fontSize: 14, marginLeft: 12 },
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    marginBottom: 16,
  },
  logoutText: {
    color: "#E53935",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 10,
  },
  deleteBtn: { alignItems: "center", marginBottom: 30 },
  deleteText: { color: "#E53935", fontSize: 12, fontWeight: "600" },
  version: { textAlign: "center", color: "#3A3A3A", fontSize: 10 },
});

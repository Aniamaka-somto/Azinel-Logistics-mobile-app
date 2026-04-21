import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState, useCallback } from "react";

import { COLORS, SPACING, RADIUS } from "../../constants/theme";

type NotifType = "ride" | "promo" | "payment" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFS: Notification[] = [
  {
    id: "1",
    type: "ride",
    title: "Driver is arriving",
    message: "Emmanuel K. is 2 minutes away in a Toyota Corolla.",
    time: "Just now",
    read: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Payment successful",
    message: "₦1,500 paid for your ride to University of Benin.",
    time: "10 mins ago",
    read: false,
  },
  {
    id: "3",
    type: "promo",
    title: "20% off your next ride!",
    message: "Use code AZINEL20 before end of month. Valid on all ride types.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "ride",
    title: "Trip completed",
    message: "Your ride to UNIBEN is complete. Rate your experience.",
    time: "Today, 10:45 AM",
    read: true,
  },
  {
    id: "5",
    type: "system",
    title: "Welcome to Azinel!",
    message:
      "Book your first ride today and enjoy a smooth experience across Nigerian cities.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "payment",
    title: "Wallet topped up",
    message: "₦5,000 has been added to your Azinel wallet.",
    time: "2 days ago",
    read: true,
  },
];

const NOTIF_CONFIG: Record<
  NotifType,
  { icon: string; color: string; bg: string }
> = {
  ride: { icon: "car", color: COLORS.primary, bg: "#FFF5F6" },
  promo: { icon: "gift", color: "#F59E0B", bg: "#FFFBEB" },
  payment: { icon: "wallet", color: "#22C55E", bg: "#F0FDF4" },
  system: { icon: "notifications", color: "#6366F1", bg: "#EEF2FF" },
};

export default function UserNotifications() {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<NotifType | "all">("all");

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const deleteNotif = (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filtered =
    filter === "all" ? notifs : notifs.filter((n) => n.type === filter);

  const FILTERS: { id: NotifType | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "ride", label: "Rides" },
    { id: "payment", label: "Payments" },
    { id: "promo", label: "Promos" },
    { id: "system", label: "System" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unread badge */}
      {unreadCount > 0 && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.unreadBanner}
        >
          <View style={styles.unreadDot} />
          <Text style={styles.unreadText}>
            {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
          </Text>
        </Animated.View>
      )}

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.filterChip,
              filter === f.id && styles.filterChipActive,
            ]}
            onPress={() => setFilter(f.id)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.id && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notifications list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {filtered.length === 0 ? (
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={styles.emptyWrap}
          >
            <Ionicons name="notifications-off-outline" size={48} color="#DDD" />
            <Text style={styles.emptyText}>No notifications here</Text>
          </Animated.View>
        ) : (
          filtered.map((notif, i) => {
            const config = NOTIF_CONFIG[notif.type];
            return (
              <Animated.View
                key={notif.id}
                entering={FadeInDown.delay(i * 60).duration(400)}
              >
                <TouchableOpacity
                  style={[
                    styles.notifCard,
                    !notif.read && styles.notifCardUnread,
                  ]}
                  onPress={() => markRead(notif.id)}
                  activeOpacity={0.85}
                >
                  <View
                    style={[styles.notifIcon, { backgroundColor: config.bg }]}
                  >
                    <Ionicons
                      name={config.icon as any}
                      size={20}
                      color={config.color}
                    />
                  </View>

                  <View style={styles.notifBody}>
                    <View style={styles.notifTitleRow}>
                      <Text style={styles.notifTitle} numberOfLines={1}>
                        {notif.title}
                      </Text>
                      {!notif.read && <View style={styles.unreadIndicator} />}
                    </View>
                    <Text style={styles.notifMessage} numberOfLines={2}>
                      {notif.message}
                    </Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteNotif(notif.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="close" size={16} color="#CCC" />
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            );
          })
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
  title: { flex: 1, fontSize: 20, fontWeight: "800", color: "#111" },
  markAllBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  markAllText: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },

  unreadBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    backgroundColor: "#FFF5F6",
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: "#FFD6DA",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  unreadText: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },

  filterScroll: { maxHeight: 44 },
  filterContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    alignItems: "center",
    paddingBottom: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
  },
  filterChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#FFF5F6",
  },
  filterText: { fontSize: 13, fontWeight: "500", color: "#888" },
  filterTextActive: { color: COLORS.primary, fontWeight: "700" },

  scroll: { padding: SPACING.lg, paddingTop: SPACING.sm },

  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    backgroundColor: "#fff",
    marginBottom: SPACING.sm,
  },
  notifCardUnread: {
    backgroundColor: "#FFFAFA",
    borderColor: "#FFD6DA",
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  notifBody: { flex: 1 },
  notifTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: 4,
  },
  notifTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    flexShrink: 0,
  },
  notifMessage: {
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
    marginBottom: 4,
  },
  notifTime: { fontSize: 11, color: "#BBB" },
  deleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },

  emptyWrap: {
    alignItems: "center",
    paddingVertical: 60,
    gap: SPACING.md,
  },
  emptyText: { fontSize: 15, color: "#BBB" },
});

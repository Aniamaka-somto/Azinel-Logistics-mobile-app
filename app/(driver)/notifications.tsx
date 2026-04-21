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

type NotifType = "ride" | "earnings" | "system" | "alert";

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
    title: "New ride request",
    message: "Pickup at Ring Road. ₦1,500 · 5 mins away.",
    time: "Just now",
    read: false,
  },
  {
    id: "2",
    type: "earnings",
    title: "Payout processed",
    message: "₦12,500 has been sent to your GTBank account ···4521.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "alert",
    title: "Document expiring soon",
    message: "Your vehicle insurance expires in 14 days. Please renew it.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "ride",
    title: "Trip completed",
    message: "Your trip to UNIBEN is complete. ₦1,500 added to earnings.",
    time: "Today, 10:45 AM",
    read: true,
  },
  {
    id: "5",
    type: "earnings",
    title: "Bonus earned!",
    message: "You completed 5 trips today. ₦500 bonus added to your wallet.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    type: "system",
    title: "App update available",
    message: "A new version of Azinel is available with improved features.",
    time: "2 days ago",
    read: true,
  },
];

const NOTIF_CONFIG: Record<
  NotifType,
  { icon: string; color: string; bg: string }
> = {
  ride: { icon: "car", color: COLORS.primary, bg: "#FFF5F6" },
  earnings: { icon: "cash", color: "#22C55E", bg: "#F0FDF4" },
  alert: { icon: "warning", color: "#F59E0B", bg: "#FFFBEB" },
  system: { icon: "settings", color: "#6366F1", bg: "#EEF2FF" },
};

export default function DriverNotifications() {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  const deleteNotif = (id: string) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
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
        {notifs.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="notifications-off-outline" size={48} color="#DDD" />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        ) : (
          notifs.map((notif, i) => {
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
  markAllBtn: { paddingHorizontal: SPACING.sm, paddingVertical: 4 },
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

  scroll: { padding: SPACING.lg },

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
  notifTitle: { flex: 1, fontSize: 14, fontWeight: "700", color: "#111" },
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

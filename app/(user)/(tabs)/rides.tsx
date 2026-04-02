import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

const HISTORY = [
  {
    id: "1",
    from: "Home",
    to: "Oba Market",
    date: "Today, 10:32 AM",
    price: "₦1,500",
    status: "Completed",
  },
  {
    id: "2",
    from: "Ring Road",
    to: "University of Benin",
    date: "Yesterday, 3:15 PM",
    price: "₦2,200",
    status: "Completed",
  },
  {
    id: "3",
    from: "Airport",
    to: "GRA",
    date: "Mon, 8:00 AM",
    price: "₦3,500",
    status: "Cancelled",
  },
];

export default function Rides() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Ride History</Text>

      <FlatList
        data={HISTORY}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: SPACING.sm }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconCol}>
              <View style={styles.dot} />
              <View style={styles.line} />
              <View style={[styles.dot, { backgroundColor: "#111" }]} />
            </View>

            <View style={styles.info}>
              <Text style={styles.from}>{item.from}</Text>
              <Text style={styles.to}>{item.to}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>

            <View style={styles.right}>
              <Text style={styles.price}>{item.price}</Text>
              <Text
                style={[
                  styles.status,
                  item.status === "Cancelled" && { color: "#E60023" },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        )}
      />
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
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    gap: SPACING.sm,
  },
  iconCol: {
    alignItems: "center",
    gap: 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  line: {
    width: 2,
    height: 20,
    backgroundColor: "#DDD",
  },
  info: { flex: 1 },
  from: { fontWeight: "600", color: "#111", fontSize: 14 },
  to: { color: "#555", fontSize: 14, marginTop: 4 },
  date: { color: "#999", fontSize: 12, marginTop: 4 },
  right: { alignItems: "flex-end" },
  price: { fontWeight: "700", color: "#111" },
  status: { fontSize: 12, color: "green", marginTop: 4 },
});

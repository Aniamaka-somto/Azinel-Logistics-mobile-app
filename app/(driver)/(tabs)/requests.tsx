import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SPACING } from "../../../constants/theme";

const REQUESTS = [
  {
    id: "1",
    from: "Ring Road",
    to: "UNIBEN",
    price: "₦1,500",
    time: "2 min ago",
    status: "pending",
  },
  {
    id: "2",
    from: "Airport",
    to: "GRA",
    price: "₦3,500",
    time: "5 min ago",
    status: "missed",
  },
  {
    id: "3",
    from: "Oba Market",
    to: "Ugbowo",
    price: "₦1,800",
    time: "12 min ago",
    status: "accepted",
  },
];

export default function Requests() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Ride Requests</Text>

      <FlatList
        data={REQUESTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: SPACING.sm }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.from}>{item.from}</Text>
                <Text style={styles.arrow}>↓</Text>
                <Text style={styles.to}>{item.to}</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.price}>{item.price}</Text>
                <Text
                  style={[
                    styles.status,
                    item.status === "missed" && { color: "#E60023" },
                    item.status === "accepted" && { color: "#22C55E" },
                    item.status === "pending" && { color: "#F59E0B" },
                  ]}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={styles.time}>{item.time}</Text>
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
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  from: { fontWeight: "600", color: "#111" },
  arrow: { color: COLORS.primary, fontWeight: "700" },
  to: { color: "#555" },
  right: { alignItems: "flex-end" },
  price: { fontWeight: "700", fontSize: 16, color: "#111" },
  status: { fontSize: 12, marginTop: 4 },
  time: { fontSize: 12, color: "#999", marginTop: SPACING.sm },
});

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TripCompletedScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>AZINEL</Text>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=11" }}
          style={styles.profileImg}
        />
      </View>

      {/* Success Icon */}
      <View style={styles.successContainer}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>
      </View>

      <Text style={styles.title}>TRIP COMPLETED!</Text>
      <Text style={styles.subtitle}>YOU HAVE ARRIVED AT YOUR DESTINATION</Text>

      {/* Invoice Card */}
      <View style={styles.invoiceCard}>
        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceLabel}>TOTAL FARE</Text>
          <View style={styles.finalBadge}>
            <Text style={styles.finalText}>FINAL INVOICE</Text>
          </View>
        </View>

        <Text style={styles.fareAmount}>$428.50</Text>

        <View style={styles.divider} />

        <View style={styles.locationRow}>
          <Ionicons name="radio-button-on" size={16} color="#E53935" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>PICKUP</Text>
            <Text style={styles.locationValue}>
              Mandarin Oriental, New York
            </Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color="#E53935" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>DESTINATION</Text>
            <Text style={styles.locationValue}>
              JFK International Airport (T4)
            </Text>
          </View>
        </View>
      </View>

      {/* Rating */}
      <Text style={styles.rateTitle}>RATE YOUR EXPERIENCE</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star"}
              size={32}
              color={star <= rating ? "#E53935" : "#3A3A3A"}
            />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.commentInput}
        placeholder="Leave a comment about the chauffeur or vehicle..."
        placeholderTextColor="#3A3A3A"
        multiline
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.submitText}>SUBMIT RATING</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.downloadBtn}>
        <Ionicons name="download" size={20} color="#B0B0B0" />
        <Text style={styles.downloadText}>DOWNLOAD RECEIPT</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
        <Text style={styles.dashboardLink}>RETURN TO DASHBOARD</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 40,
    marginBottom: 40,
  },
  logo: {
    color: "#E53935",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 2,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1A1A1A",
    borderWidth: 3,
    borderColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#B0B0B0",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    letterSpacing: 1,
  },
  invoiceCard: {
    backgroundColor: "#1A1A1A",
    padding: 24,
    borderRadius: 20,
    marginTop: 30,
  },
  invoiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  invoiceLabel: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "600",
  },
  finalBadge: {
    backgroundColor: "#E53935",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  finalText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  fareAmount: {
    color: "#E53935",
    fontSize: 48,
    fontWeight: "900",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#3A3A3A",
    marginVertical: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  locationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  locationLabel: {
    color: "#B0B0B0",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
  },
  locationValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  rateTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  commentInput: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 12,
    padding: 16,
    height: 100,
    color: "#fff",
    fontSize: 14,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: "#E53935",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  downloadBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    gap: 10,
    marginBottom: 30,
  },
  downloadText: {
    color: "#B0B0B0",
    fontWeight: "600",
    fontSize: 14,
  },
  dashboardLink: {
    color: "#3A3A3A",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: 1,
  },
});

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useState } from "react";

import { COLORS, SPACING, RADIUS } from "../../../constants/theme";
import { rateRide } from "../../../services/api";
import { useRideStore } from "../../../store/useRideStore";

const TIPS = [0, 100, 200, 500];

const QUICK_FEEDBACK = [
  "Great driver",
  "Very punctual",
  "Clean vehicle",
  "Safe driving",
  "Friendly",
  "Professional",
];

export default function TripRating() {
  const { bookingId, driverName, vehicleInfo } = useLocalSearchParams<{
    bookingId: string;
    driverName: string;
    vehicleInfo: string;
  }>();
  const { resetRide } = useRideStore();

  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedTip, setSelectedTip] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleFeedback = (item: string) => {
    setFeedback((prev) =>
      prev.includes(item) ? prev.filter((f) => f !== item) : [...prev, item],
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Rate your trip", "Please select a star rating.");
      return;
    }
    setLoading(true);
    try {
      await rateRide(bookingId, rating);
      resetRide();
      setSubmitted(true);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Could not submit rating.");
    } finally {
      setLoading(false);
    }
  };

  const STAR_LABELS = ["", "Terrible", "Bad", "Okay", "Good", "Excellent"];
  const activeRating = hoveredStar || rating;

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.successWrap}
        >
          <Animated.View
            entering={ZoomIn.delay(200)}
            style={styles.successIcon}
          >
            <Ionicons name="heart" size={48} color={COLORS.primary} />
          </Animated.View>
          <Text style={styles.successTitle}>Thanks for rating!</Text>
          <Text style={styles.successSub}>
            Your feedback helps improve the experience for everyone.
          </Text>
          {selectedTip > 0 && (
            <View style={styles.tipConfirm}>
              <Ionicons name="gift-outline" size={16} color="#22C55E" />
              <Text style={styles.tipConfirmText}>
                ₦{selectedTip} tip sent to {driverName ?? "your driver"}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => router.replace("/(user)/(tabs)")}
          >
            <Text style={styles.doneBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Driver info */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.driverCard}
        >
          <View style={styles.driverAvatar}>
            <Ionicons name="person" size={32} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.driverName}>{driverName ?? "Your Driver"}</Text>
            <Text style={styles.vehicleInfo}>
              {vehicleInfo ?? "Trip completed"}
            </Text>
          </View>
        </Animated.View>

        {/* Star rating */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.ratingSection}
        >
          <Text style={styles.ratingQuestion}>How was your trip?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                onPressIn={() => setHoveredStar(star)}
                onPressOut={() => setHoveredStar(0)}
                activeOpacity={0.8}
              >
                <Animated.View>
                  <Ionicons
                    name={activeRating >= star ? "star" : "star-outline"}
                    size={44}
                    color={activeRating >= star ? "#FFB800" : "#DDD"}
                  />
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          {activeRating > 0 && (
            <Animated.Text
              entering={FadeInDown.duration(200)}
              style={styles.starLabel}
            >
              {STAR_LABELS[activeRating]}
            </Animated.Text>
          )}
        </Animated.View>

        {/* Quick feedback chips */}
        {rating >= 4 && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={styles.section}
          >
            <Text style={styles.sectionLabel}>What went well?</Text>
            <View style={styles.chipGrid}>
              {QUICK_FEEDBACK.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.chip,
                    feedback.includes(item) && styles.chipActive,
                  ]}
                  onPress={() => toggleFeedback(item)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      feedback.includes(item) && styles.chipTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Tip section */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionLabel}>Add a tip (optional)</Text>
          <View style={styles.tipRow}>
            {TIPS.map((tip) => (
              <TouchableOpacity
                key={tip}
                style={[
                  styles.tipChip,
                  selectedTip === tip && styles.tipChipActive,
                ]}
                onPress={() => setSelectedTip(tip)}
              >
                <Text
                  style={[
                    styles.tipText,
                    selectedTip === tip && styles.tipTextActive,
                  ]}
                >
                  {tip === 0 ? "No tip" : `₦${tip}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Comment */}
        <Animated.View
          entering={FadeInDown.delay(250).duration(400)}
          style={styles.section}
        >
          <Text style={styles.sectionLabel}>
            Additional comments (optional)
          </Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Tell us more about your experience..."
            placeholderTextColor="#BBB"
            multiline
            numberOfLines={3}
            value={comment}
            onChangeText={setComment}
          />
        </Animated.View>
      </ScrollView>

      {/* Submit */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (rating === 0 || loading) && styles.submitDisabled,
          ]}
          onPress={handleSubmit}
          disabled={rating === 0 || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Rating</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => {
            resetRide();
            router.replace("/(user)/(tabs)");
          }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: SPACING.lg, paddingBottom: 120 },

  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: "#FFF5F6",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#FFD6DA",
    marginBottom: SPACING.lg,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFD6DA",
  },
  driverName: { fontSize: 17, fontWeight: "700", color: "#111" },
  vehicleInfo: { fontSize: 13, color: "#888", marginTop: 2 },

  ratingSection: { alignItems: "center", marginBottom: SPACING.lg },
  ratingQuestion: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: SPACING.md,
  },
  starsRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.sm },
  starLabel: { fontSize: 15, fontWeight: "600", color: COLORS.primary },

  section: { marginBottom: SPACING.lg },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.sm,
  },

  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
  },
  chipActive: { borderColor: COLORS.primary, backgroundColor: "#FFF5F6" },
  chipText: { fontSize: 13, fontWeight: "500", color: "#555" },
  chipTextActive: { color: COLORS.primary, fontWeight: "700" },

  tipRow: { flexDirection: "row", gap: SPACING.sm },
  tipChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
  },
  tipChipActive: { borderColor: COLORS.primary, backgroundColor: "#FFF5F6" },
  tipText: { fontSize: 13, fontWeight: "500", color: "#555" },
  tipTextActive: { color: COLORS.primary, fontWeight: "700" },

  commentInput: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    fontSize: 14,
    color: "#111",
    textAlignVertical: "top",
    minHeight: 90,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: SPACING.sm,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  submitDisabled: { opacity: 0.45 },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  skipBtn: { alignItems: "center", padding: SPACING.sm },
  skipText: { color: "#999", fontSize: 14 },

  successWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD6DA",
  },
  successTitle: { fontSize: 24, fontWeight: "800", color: "#111" },
  successSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
  tipConfirm: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: "#F0FDF4",
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  tipConfirmText: { fontSize: 13, color: "#166534", fontWeight: "600" },
  doneBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },
  doneBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

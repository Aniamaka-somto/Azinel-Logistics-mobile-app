import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import { uploadDriverDocs } from "../../services/api";

type DocStatus = "missing" | "uploaded" | "verified" | "rejected";

interface Document {
  id: string;
  label: string;
  description: string;
  icon: string;
  fieldName: string;
  status: DocStatus;
  file?: string;
}

const STATUS_CONFIG: Record<
  DocStatus,
  { label: string; color: string; bg: string }
> = {
  missing: { label: "Not uploaded", color: "#999", bg: "#F5F5F5" },
  uploaded: { label: "Under review", color: "#F59E0B", bg: "#FFFBEB" },
  verified: { label: "Verified", color: "#22C55E", bg: "#F0FDF4" },
  rejected: { label: "Rejected", color: COLORS.primary, bg: "#FFF5F6" },
};

export default function DriverDocuments() {
  const [docs, setDocs] = useState<Document[]>([
    {
      id: "license",
      label: "Driver's License",
      description: "Front and back of your valid driver's license",
      icon: "id-card-outline",
      fieldName: "licenseDoc",
      status: "missing",
    },
    {
      id: "vehicle",
      label: "Vehicle Registration",
      description: "Current vehicle registration certificate",
      icon: "car-outline",
      fieldName: "vehicleDoc",
      status: "missing",
    },
    {
      id: "insurance",
      label: "Vehicle Insurance",
      description: "Valid motor insurance certificate",
      icon: "shield-checkmark-outline",
      fieldName: "insuranceDoc",
      status: "missing",
    },
    {
      id: "inspection",
      label: "Vehicle Inspection",
      description: "Valid roadworthiness certificate",
      icon: "checkmark-circle-outline",
      fieldName: "inspectionDoc",
      status: "missing",
    },
  ]);

  const [uploading, setUploading] = useState<string | null>(null);

  const pickAndUpload = async (doc: Document) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setUploading(doc.id);

    try {
      const formData = new FormData();
      formData.append(doc.fieldName, {
        uri: asset.uri,
        name: `${doc.fieldName}.jpg`,
        type: "image/jpeg",
      } as any);

      await uploadDriverDocs(formData);

      setDocs((prev) =>
        prev.map((d) =>
          d.id === doc.id ? { ...d, status: "uploaded", file: asset.uri } : d,
        ),
      );
    } catch (err: any) {
      Alert.alert("Upload failed", err.message ?? "Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const allVerified = docs.every((d) => d.status === "verified");
  const uploadedCount = docs.filter((d) => d.status !== "missing").length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Documents</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Progress */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.progressCard}
        >
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>Verification Progress</Text>
            <Text style={styles.progressCount}>
              {uploadedCount}/{docs.length} uploaded
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(uploadedCount / docs.length) * 100}%` },
              ]}
            />
          </View>
          {allVerified ? (
            <View style={styles.verifiedBanner}>
              <Ionicons name="shield-checkmark" size={16} color="#22C55E" />
              <Text style={styles.verifiedText}>All documents verified!</Text>
            </View>
          ) : (
            <Text style={styles.progressNote}>
              Upload all documents to start accepting rides.
            </Text>
          )}
        </Animated.View>

        {/* Document cards */}
        {docs.map((doc, i) => {
          const statusConfig = STATUS_CONFIG[doc.status];
          const isUploading = uploading === doc.id;

          return (
            <Animated.View
              key={doc.id}
              entering={FadeInDown.delay(i * 80).duration(400)}
              style={styles.docCard}
            >
              <View style={styles.docIconWrap}>
                <Ionicons
                  name={doc.icon as any}
                  size={24}
                  color={doc.status === "verified" ? "#22C55E" : COLORS.primary}
                />
              </View>

              <View style={styles.docInfo}>
                <Text style={styles.docLabel}>{doc.label}</Text>
                <Text style={styles.docDesc}>{doc.description}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusConfig.bg },
                  ]}
                >
                  <Text
                    style={[styles.statusText, { color: statusConfig.color }]}
                  >
                    {statusConfig.label}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.uploadBtn,
                  doc.status === "verified" && styles.uploadBtnDone,
                ]}
                onPress={() => pickAndUpload(doc)}
                disabled={isUploading || doc.status === "verified"}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : doc.status === "verified" ? (
                  <Ionicons name="checkmark" size={20} color="#22C55E" />
                ) : doc.status === "uploaded" ? (
                  <Ionicons
                    name="refresh-outline"
                    size={20}
                    color={COLORS.primary}
                  />
                ) : (
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.primary}
                  />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Info */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={COLORS.primary}
          />
          <Text style={styles.infoText}>
            Documents are reviewed within 24 hours. You&apos;ll be notified once
            verified. Make sure all images are clear and not expired.
          </Text>
        </View>
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
  scroll: { padding: SPACING.lg, paddingBottom: 40 },

  progressCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  progressLabel: { fontSize: 14, fontWeight: "700", color: "#111" },
  progressCount: { fontSize: 13, color: "#888" },
  progressBar: {
    height: 6,
    backgroundColor: "#EAEAEA",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  verifiedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifiedText: { fontSize: 13, color: "#22C55E", fontWeight: "600" },
  progressNote: { fontSize: 12, color: "#999" },

  docCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    backgroundColor: "#fff",
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  docIconWrap: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
  },
  docInfo: { flex: 1 },
  docLabel: { fontSize: 14, fontWeight: "700", color: "#111" },
  docDesc: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    marginBottom: SPACING.xs,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: { fontSize: 11, fontWeight: "600" },
  uploadBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFD6DA",
  },
  uploadBtnDone: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },

  infoCard: {
    flexDirection: "row",
    gap: SPACING.sm,
    backgroundColor: "#FFF5F6",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#FFD6DA",
    padding: SPACING.md,
    marginTop: SPACING.sm,
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 12, color: "#555", lineHeight: 18 },
});

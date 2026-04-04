import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";

import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import Input from "../../components/Input";

export default function ForgotPassword() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (phone.trim().length < 10) return;
    setLoading(true);
    try {
      // TODO: await api.post("/auth/forgot-password", { phone });
      await new Promise((r) => setTimeout(r, 1500));
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inner}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>

          {!sent ? (
            <>
              <Animated.View
                entering={FadeInDown.duration(400)}
                style={styles.header}
              >
                <View style={styles.iconWrap}>
                  <Ionicons
                    name="lock-open-outline"
                    size={36}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                  Enter your registered phone number. We&apos;ll send you a
                  reset code.
                </Text>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(150).duration(400)}
                style={styles.form}
              >
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <View style={styles.inputRow}>
                  <View style={styles.prefix}>
                    <Text style={styles.prefixText}>🇳🇬 +234</Text>
                  </View>
                  <Input
                    placeholder="0801 234 5678"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    (phone.trim().length < 10 || loading) && { opacity: 0.5 },
                  ]}
                  onPress={handleSend}
                  disabled={phone.trim().length < 10 || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.sendText}>Send Reset Code</Text>
                  )}
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <Animated.View
              entering={FadeInDown.duration(400)}
              style={styles.successWrap}
            >
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={56} color="#22C55E" />
              </View>
              <Text style={styles.successTitle}>Code Sent!</Text>
              <Text style={styles.successSub}>
                We sent a reset code to{"\n"}+234 {phone}
              </Text>
              <TouchableOpacity
                style={styles.backToLogin}
                onPress={() => router.replace("/auth")}
              >
                <Text style={styles.backToLoginText}>Back to Sign In</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: { flex: 1, paddingHorizontal: SPACING.lg },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  header: { marginBottom: SPACING.xl },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFF5F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.lg,
    borderWidth: 1.5,
    borderColor: "#FFD6DA",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#111",
    marginBottom: SPACING.sm,
  },
  subtitle: { fontSize: 15, color: "#888", lineHeight: 24 },

  form: { gap: SPACING.md },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    borderRadius: RADIUS.md,
    overflow: "hidden",
    backgroundColor: "#FAFAFA",
  },
  prefix: {
    paddingHorizontal: SPACING.sm,
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    borderRightWidth: 1,
    borderRightColor: "#EAEAEA",
  },
  prefixText: { fontSize: 14, fontWeight: "600", color: "#444" },
  phoneInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "transparent",
    borderRadius: 0,
  },

  sendBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  sendText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  successWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.md,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#BBF7D0",
  },
  successTitle: { fontSize: 26, fontWeight: "900", color: "#111" },
  successSub: {
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
  },
  backToLogin: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },
  backToLoginText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

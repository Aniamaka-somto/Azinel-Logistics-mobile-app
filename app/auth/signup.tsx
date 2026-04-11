import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useState } from "react";
import { StatusBar } from "expo-status-bar";

import { COLORS, SPACING, RADIUS } from "../../constants/theme";
import Input from "../../components/Input";
import { registerUser } from "../../services/api"; // ← real API
import AsyncStorage from "@react-native-async-storage/async-storage";

type Role = "user" | "driver";

export default function Signup() {
  const [role, setRole] = useState<Role>("user");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    if (!fullName.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (phone.trim().length < 10) {
      setError("Enter a valid phone number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            phone,
            email: email || undefined,
            password,
            role: role.toUpperCase(),
          }),
        },
      );

      const json = await res.json();

      if (!res.ok) {
        setError(json.message ?? "Registration failed.");
        return;
      }

      await AsyncStorage.setItem("token", json.data.token);
      await AsyncStorage.setItem("userId", json.data.user.id);
      await AsyncStorage.setItem("userRole", json.data.user.role);
      await AsyncStorage.setItem("userName", json.data.user.fullName);

      // Route based on role
      if (json.data.user.role === "DRIVER") {
        router.replace("/(driver)/(tabs)");
      } else {
        router.replace("/(user)/(tabs)");
      }
    } catch (e) {
      setError("Could not connect to server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>

          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={styles.header}
          >
            <Text style={styles.logo}>⚡ Azinel</Text>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join thousands moving smarter</Text>
          </Animated.View>

          {/* Role selector */}
          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            <Text style={styles.fieldLabel}>I want to</Text>
            <View style={styles.roleRow}>
              {(
                [
                  { id: "user", label: "Book Rides", icon: "person-outline" },
                  { id: "driver", label: "Drive & Earn", icon: "car-outline" },
                ] as { id: Role; label: string; icon: string }[]
              ).map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.roleCard,
                    role === r.id && styles.roleCardActive,
                  ]}
                  onPress={() => setRole(r.id)}
                >
                  <Ionicons
                    name={r.icon as any}
                    size={22}
                    color={role === r.id ? COLORS.primary : "#999"}
                  />
                  <Text
                    style={[
                      styles.roleLabel,
                      role === r.id && styles.roleLabelActive,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInDown.delay(150).duration(400)}
            style={styles.form}
          >
            {/* Full name */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Full Name *</Text>
              <Input
                placeholder="e.g. Chidi Okeke"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Phone */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Phone Number *</Text>
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
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Email (optional)</Text>
              <Input
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Password *</Text>
              <View style={styles.passwordWrap}>
                <Input
                  placeholder="Min. 6 characters"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={{ flex: 1, borderWidth: 0 }}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Driver extra note */}
            {role === "driver" && (
              <Animated.View
                entering={FadeInDown.duration(300)}
                style={styles.driverNote}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#F59E0B"
                />
                <Text style={styles.driverNoteText}>
                  After signup you&apos;ll be asked to upload your driver&apos;s
                  license and vehicle details for verification.
                </Text>
              </Animated.View>
            )}

            {/* Error */}
            {error ? (
              <Animated.View
                entering={FadeInDown.duration(300)}
                style={styles.errorBox}
              >
                <Ionicons
                  name="alert-circle-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            ) : null}

            {/* Terms */}
            <Text style={styles.terms}>
              By signing up you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>

            {/* Signup button */}
            <TouchableOpacity
              style={[styles.signupBtn, loading && { opacity: 0.75 }]}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signupText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Login link */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={styles.loginRow}
          >
            <Text style={styles.loginPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
  },
  header: { marginBottom: SPACING.lg },
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
    marginBottom: SPACING.xs,
  },
  subtitle: { fontSize: 15, color: "#888" },

  roleRow: { flexDirection: "row", gap: SPACING.sm, marginBottom: SPACING.md },
  roleCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    backgroundColor: "#FAFAFA",
  },
  roleCardActive: { borderColor: COLORS.primary, backgroundColor: "#FFF5F6" },
  roleLabel: { fontSize: 14, fontWeight: "600", color: "#999" },
  roleLabelActive: { color: COLORS.primary },

  form: { gap: SPACING.md },
  fieldWrap: { gap: 6 },
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

  passwordWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    borderRadius: RADIUS.md,
    backgroundColor: "#FAFAFA",
    overflow: "hidden",
  },
  eyeBtn: { paddingHorizontal: SPACING.md },

  driverNote: {
    flexDirection: "row",
    gap: SPACING.sm,
    backgroundColor: "#FFFBEB",
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: SPACING.md,
    alignItems: "flex-start",
  },
  driverNoteText: { flex: 1, fontSize: 13, color: "#92400E", lineHeight: 20 },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: "#FFF5F6",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: "#FFD6DA",
    padding: SPACING.sm,
  },
  errorText: { flex: 1, fontSize: 13, color: COLORS.primary },

  terms: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  termsLink: { color: COLORS.primary, fontWeight: "600" },

  signupBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  signupText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.lg,
  },
  loginPrompt: { fontSize: 14, color: "#888" },
  loginLink: { fontSize: 14, color: COLORS.primary, fontWeight: "700" },
});

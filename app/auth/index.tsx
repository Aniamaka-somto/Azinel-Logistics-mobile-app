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

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!phone.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (phone.trim().length < 10) {
      setError("Enter a valid phone number.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with real API call
      // const res = await api.post("/auth/login", { phone, password });
      // await AsyncStorage.setItem("token", res.data.token);

      await new Promise((r) => setTimeout(r, 1500)); // mock
      router.replace("/"); // goes to role select
    } catch (e) {
      setError("Invalid credentials. Please try again.");
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
          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(400)}
            style={styles.header}
          >
            <Text style={styles.logo}>⚡ Azinel</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.form}
          >
            {/* Phone */}
            <View style={styles.fieldWrap}>
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
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.passwordWrap}>
                <Input
                  placeholder="Enter your password"
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

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push("/auth/forgot-password")}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

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

            {/* Login button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.75 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <TouchableOpacity style={styles.googleBtn}>
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.googleText}>Continue with Google</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Sign up link */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(400)}
            style={styles.signupRow}
          >
            <Text style={styles.signupPrompt}>
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/signup")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scroll: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  header: { paddingTop: SPACING.xl, marginBottom: SPACING.xl },
  logo: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#111",
    marginBottom: SPACING.xs,
  },
  subtitle: { fontSize: 16, color: "#888" },

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
  eyeBtn: {
    paddingHorizontal: SPACING.md,
  },

  forgotBtn: { alignSelf: "flex-end" },
  forgotText: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },

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

  loginBtn: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  loginText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginVertical: SPACING.xs,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#EAEAEA" },
  dividerText: { fontSize: 13, color: "#999" },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: "#EAEAEA",
    backgroundColor: "#fff",
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primary,
  },
  googleText: { fontSize: 15, fontWeight: "600", color: "#333" },

  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  signupPrompt: { fontSize: 14, color: "#888" },
  signupLink: { fontSize: 14, color: COLORS.primary, fontWeight: "700" },
});

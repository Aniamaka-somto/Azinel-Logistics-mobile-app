import React, { useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, FontFamilies, Radius, Shadows } from "../constants/theme";

type RegisterScreenProps = {
  navigation?: any;
};

type InputFieldProps = {
  icon: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: any;
  secureTextEntry?: boolean;
  rightElement?: React.ReactNode;
  dialCode?: boolean;
};

function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  rightElement,
  dialCode = false,
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}>
      <Text style={styles.inputIcon}>{icon}</Text>
      {dialCode && (
        <>
          <Text style={styles.dialCode}>+234</Text>
          <View style={styles.divider} />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        selectionColor={Colors.primaryRed}
      />
      {rightElement}
    </View>
  );
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const scaleBtn = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scaleBtn, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scaleBtn, { toValue: 1, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerLogo}>AZINEL</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <View style={styles.heroSection}>
            <Text style={styles.headline}>Create Account</Text>
            <Text style={styles.subtext}>
              Join thousands of Nigerians moving smarter.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <InputField
              icon="👤"
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <InputField
              icon="📞"
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              dialCode
            />
            <InputField
              icon="✉️"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <InputField
              icon="🔒"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              rightElement={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeIcon}>
                    {showPassword ? "👁" : "🙈"}
                  </Text>
                </TouchableOpacity>
              }
            />
            <InputField
              icon="🔒"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.8}
          >
            <View
              style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
            >
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              I agree to Azinel's <Text style={styles.termsLink}>Terms</Text>
              {" & "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* CTA */}
          <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                !agreedToTerms && styles.primaryBtnDisabled,
              ]}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              activeOpacity={1}
              disabled={!agreedToTerms}
              onPress={() => navigation?.navigate("Home")}
            >
              <Text style={styles.primaryBtnText}>CREATE ACCOUNT</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Login Link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already registered? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate("Login")}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>

          {/* Social */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>OR JOIN WITH</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialBtnText}>🇬 Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialBtnText}>🍎 Apple</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    color: Colors.white,
    fontSize: 18,
  },
  headerLogo: {
    fontFamily: FontFamilies.syneExtraBold,
    fontSize: 18,
    color: Colors.primaryRed,
    letterSpacing: 3,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  heroSection: {
    marginTop: 12,
    marginBottom: 32,
  },
  headline: {
    fontFamily: FontFamilies.syne,
    fontSize: 30,
    color: Colors.white,
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtext: {
    fontFamily: FontFamilies.dmSans,
    fontSize: 14,
    color: Colors.gray,
  },
  form: {
    gap: 14,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface2,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
    paddingHorizontal: 16,
    height: 58,
    gap: 10,
  },
  inputWrapperFocused: {
    borderColor: Colors.primaryRed,
    shadowColor: Colors.primaryRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    fontSize: 16,
  },
  dialCode: {
    fontFamily: FontFamilies.dmSansMedium,
    fontSize: 14,
    color: Colors.white,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: Colors.ghostBorder,
  },
  input: {
    flex: 1,
    fontFamily: FontFamilies.dmSans,
    fontSize: 15,
    color: Colors.white,
  },
  eyeIcon: {
    fontSize: 14,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 24,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.ghostBorder,
    backgroundColor: Colors.surface2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: Colors.primaryRed,
    borderColor: Colors.primaryRed,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  termsText: {
    flex: 1,
    fontFamily: FontFamilies.dmSans,
    fontSize: 13,
    color: Colors.lightGray,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primaryRed,
    fontFamily: FontFamilies.dmSansBold,
  },
  primaryBtn: {
    backgroundColor: Colors.primaryRed,
    borderRadius: Radius.button,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.redGlow,
  },
  primaryBtnDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    fontFamily: FontFamilies.syne,
    fontSize: 14,
    color: Colors.white,
    letterSpacing: 2,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  loginText: {
    fontFamily: FontFamilies.dmSans,
    fontSize: 14,
    color: Colors.gray,
  },
  loginLink: {
    fontFamily: FontFamilies.dmSansBold,
    fontSize: 14,
    color: Colors.primaryRed,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.ghostBorder,
  },
  dividerLabel: {
    fontFamily: FontFamilies.syne,
    fontSize: 9,
    color: Colors.gray,
    letterSpacing: 2,
  },
  socialRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.surface1,
    borderRadius: Radius.input,
    borderWidth: 1,
    borderColor: Colors.ghostBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  socialBtnText: {
    fontFamily: FontFamilies.dmSansMedium,
    fontSize: 13,
    color: Colors.lightGray,
  },
});

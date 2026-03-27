import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>AZINEL</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your credentials to continue</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>PHONE NUMBER</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.countryCode}>+234</Text>
            <TextInput
              style={styles.input}
              placeholder="800 000 0000"
              placeholderTextColor="#3A3A3A"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>PASSWORD</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#3A3A3A"
              secureTextEntry
            />
            <Ionicons name="eye-outline" size={20} color="#3A3A3A" />
          </View>
        </View>

        <TouchableOpacity style={styles.forgot}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.loginBtnText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialText}>GOOGLE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialText}> Apple</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Decorative Car Image */}
      <View style={styles.carContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop",
          }}
          style={styles.carImage}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#000000", paddingBottom: 40 },
  header: { paddingTop: 80, alignItems: "center", marginBottom: 40 },
  logo: { color: "#E53935", fontSize: 32, fontWeight: "900", letterSpacing: 2 },
  content: { padding: 24 },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "#B0B0B0",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    color: "#3A3A3A",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  countryCode: { color: "#FFFFFF", fontWeight: "600", marginRight: 12 },
  input: { flex: 1, color: "#FFFFFF", fontSize: 16 },
  forgot: { alignSelf: "flex-end", marginBottom: 24 },
  forgotText: { color: "#E53935", fontSize: 12, fontWeight: "600" },
  loginBtn: {
    backgroundColor: "#E53935",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
  },
  divider: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  line: { flex: 1, height: 1, backgroundColor: "#3A3A3A" },
  dividerText: { color: "#3A3A3A", fontSize: 10, marginHorizontal: 16 },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  socialBtn: {
    width: "48%",
    height: 56,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  socialText: { color: "#FFFFFF", fontWeight: "700" },
  signupRow: { flexDirection: "row", justifyContent: "center" },
  signupText: { color: "#B0B0B0", fontSize: 14 },
  signupLink: { color: "#E53935", fontWeight: "700", fontSize: 14 },
  carContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    opacity: 0.4,
  },
  carImage: { width: "100%", height: 300, resizeMode: "contain" },
});

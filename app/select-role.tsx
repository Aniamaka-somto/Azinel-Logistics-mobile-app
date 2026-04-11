import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { COLORS, SPACING } from "../constants/theme";

export default function RoleSelect() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>Aziniel Logistics</Text>
        <Text style={styles.tagline}>Where do you want to go?</Text>
      </View>

      <View style={styles.actions}>
        <Button
          title="I'm a Passenger"
          onPress={() => router.replace("/(user)/(tabs)")}
        />

        <View style={{ height: SPACING.sm }} />

        <Button
          title="I'm a Driver"
          onPress={() => router.replace("/(driver)/(tabs)")}
          variant="outline"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.lg,
    justifyContent: "space-between",
    paddingBottom: SPACING.xl,
  },
  hero: {
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
  },
  actions: {
    paddingBottom: SPACING.md,
  },
});

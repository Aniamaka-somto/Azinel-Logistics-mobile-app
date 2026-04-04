import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../constants/theme";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

export default function Splash() {
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(20);
  const bgScale = useSharedValue(1);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bgScale.value }],
  }));

  const navigate = async () => {
    const seen = await AsyncStorage.getItem("onboarding_seen");
    if (seen) {
      router.replace("/auth");
    } else {
      router.replace("/onboarding");
    }
  };

  useEffect(() => {
    // Logo pop in
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 600 });

    // Tagline fade in after logo
    taglineOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    taglineY.value = withDelay(600, withSpring(0));

    // Exit animation then navigate
    bgScale.value = withDelay(
      2200,
      withSequence(
        withTiming(1.05, { duration: 200 }),
        withTiming(20, { duration: 400 }),
      ),
    );

    opacity.value = withDelay(2200, withTiming(0, { duration: 300 }));
    taglineOpacity.value = withDelay(2200, withTiming(0, { duration: 300 }));

    const timer = setTimeout(() => {
      runOnJS(navigate)();
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Animated background circle */}
      <Animated.View style={[styles.bgCircle, bgStyle]} />

      {/* Logo */}
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Text style={styles.logoEmoji}>⚡</Text>
        <Text style={styles.logoText}>Azinel</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        Move smarter. Arrive faster.
      </Animated.Text>

      {/* Bottom dots */}
      <Animated.View style={[styles.bottomDots, taglineStyle]}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  bgCircle: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  bottomDots: {
    position: "absolute",
    bottom: 60,
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotActive: {
    backgroundColor: "#fff",
    width: 20,
  },
});

import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const isPrimary = variant === "primary";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.96);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.btn,
          isPrimary ? styles.primary : styles.outline,
          disabled && styles.disabled,
          animatedStyle,
        ]}
      >
        <Text style={[styles.text, !isPrimary && { color: COLORS.primary }]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  primary: { backgroundColor: COLORS.primary },
  outline: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: "#fff",
  },
  disabled: { opacity: 0.5 },
  text: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

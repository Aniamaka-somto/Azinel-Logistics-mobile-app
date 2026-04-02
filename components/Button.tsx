import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
}

export default function Button({
  title,
  onPress,
  variant = "primary",
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <TouchableOpacity
      style={[styles.btn, isPrimary ? styles.primary : styles.outline]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, !isPrimary && { color: COLORS.primary }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  outline: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: "#fff",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

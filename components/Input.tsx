import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export default function Input(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={COLORS.subtext}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 15,
    color: COLORS.text,
  },
});

import { View, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default function Screen({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

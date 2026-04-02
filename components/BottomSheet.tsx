import { StyleSheet, View } from "react-native";
import { RADIUS, SPACING } from "../constants/theme";

interface BottomSheetProps {
  children: React.ReactNode;
  height?: number;
}

export default function BottomSheet({
  children,
  height = 280,
}: BottomSheetProps) {
  return (
    <View style={[styles.sheet, { height }]}>
      {/* drag handle */}
      <View style={styles.handle} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    paddingTop: SPACING.md,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#DCDCDC",
    alignSelf: "center",
    marginBottom: SPACING.md,
  },
});

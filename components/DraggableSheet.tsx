import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { RADIUS, SPACING } from "../constants/theme";

const MAX_TRANSLATE_Y = -300;

export default function DraggableSheet({ children }) {
  const translateY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(event.translationY, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value < -150) {
        translateY.value = withSpring(MAX_TRANSLATE_Y);
      } else {
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.sheet, animatedStyle]}>
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 350,
    backgroundColor: "#fff",
    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,
    padding: SPACING.lg,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#DCDCDC",
    alignSelf: "center",
    marginBottom: SPACING.md,
    borderRadius: 2,
  },
});

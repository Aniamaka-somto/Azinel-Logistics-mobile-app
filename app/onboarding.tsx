import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  useAnimatedScrollHandler,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { COLORS, SPACING, RADIUS } from "../constants/theme";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    icon: "car-sport",
    title: "Ride in comfort",
    subtitle:
      "Book a ride in seconds. Sedan or SUV — your choice, your comfort.",
    bg: "#E60023",
    iconBg: "rgba(255,255,255,0.15)",
  },
  {
    id: "2",
    icon: "bus",
    title: "Travel city to city",
    subtitle:
      "Private intercity rides from Benin to Lagos, Abuja, PH and more. No buses, no stress.",
    bg: "#111111",
    iconBg: "rgba(255,255,255,0.1)",
  },
  {
    id: "3",
    icon: "cube",
    title: "Send packages fast",
    subtitle:
      "Logistics made easy. Send documents, parcels, or electronics across town or across the country.",
    bg: "#E60023",
    iconBg: "rgba(255,255,255,0.15)",
  },
];

export default function Onboarding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollX.value = e.contentOffset.x;
  });

  const goToNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setActiveIndex(next);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    await AsyncStorage.setItem("onboarding_seen", "true");
    router.replace("/auth");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Skip button */}
      <TouchableOpacity style={styles.skipBtn} onPress={handleFinish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
      >
        {SLIDES.map((slide, index) => {
          return (
            <SlideItem
              key={slide.id}
              slide={slide}
              index={index}
              scrollX={scrollX}
            />
          );
        })}
      </Animated.ScrollView>

      {/* Bottom controls */}
      <View style={styles.controls}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const dotStyle = useAnimatedStyle(() => {
              const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
              const dotWidth = interpolate(
                scrollX.value,
                inputRange,
                [8, 24, 8],
                Extrapolation.CLAMP,
              );
              const dotOpacity = interpolate(
                scrollX.value,
                inputRange,
                [0.4, 1, 0.4],
                Extrapolation.CLAMP,
              );
              return { width: dotWidth, opacity: dotOpacity };
            });

            return <Animated.View key={i} style={[styles.dot, dotStyle]} />;
          })}
        </View>

        {/* Next / Get Started */}
        <TouchableOpacity style={styles.nextBtn} onPress={goToNext}>
          {activeIndex === SLIDES.length - 1 ? (
            <Text style={styles.nextText}>Get Started</Text>
          ) : (
            <Ionicons name="arrow-forward" size={22} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SlideItem({
  slide,
  index,
  scrollX,
}: {
  slide: (typeof SLIDES)[0];
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const iconStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    return { transform: [{ scale }], opacity };
  });

  const textStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [40, 0, -40],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    return { transform: [{ translateY }], opacity };
  });

  return (
    <View style={[styles.slide, { backgroundColor: slide.bg }]}>
      {/* Background decoration */}
      <View style={styles.slideDecorTop} />
      <View style={styles.slideDecorBottom} />

      {/* Icon */}
      <Animated.View
        style={[styles.iconWrap, { backgroundColor: slide.iconBg }, iconStyle]}
      >
        <Ionicons name={slide.icon as any} size={72} color="#fff" />
      </Animated.View>

      {/* Text */}
      <Animated.View style={[styles.textWrap, textStyle]}>
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  skipBtn: {
    position: "absolute",
    top: 56,
    right: SPACING.lg,
    zIndex: 10,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  skipText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  slide: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xl,
  },
  slideDecorTop: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  slideDecorBottom: {
    position: "absolute",
    bottom: 100,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  iconWrap: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  textWrap: {
    alignItems: "center",
  },
  slideTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginBottom: SPACING.md,
    letterSpacing: -0.5,
  },
  slideSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 26,
    fontWeight: "400",
  },

  controls: {
    position: "absolute",
    bottom: 56,
    left: SPACING.lg,
    right: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  nextBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
  },
  nextText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth/index" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/forgot-password" />
        <Stack.Screen name="index" />
        <Stack.Screen name="(user)" />
        <Stack.Screen name="(driver)" />
      </Stack>
    </GestureHandlerRootView>
  );
}

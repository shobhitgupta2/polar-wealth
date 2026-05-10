import { Platform, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { signalCardData } from "@/constants/data";
import { useAnalytics } from "@/hooks/use-analytics";
import Animated, { FadeInDown } from "react-native-reanimated";

export function ActiveSignalCard() {
  return (
    <Animated.View
      entering={FadeInDown.delay(150).duration(500)}
      style={styles.card}
    >
      <View style={styles.badgeRow}>
        <ThemedText style={styles.heading}>{signalCardData.heading}</ThemedText>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>
            ✦ {signalCardData.badge}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.body}>{signalCardData.body}</ThemedText>
      <CtaButton />
    </Animated.View>
  );
}

function CtaButton() {
  const { trackCTA } = useAnalytics();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Review Strategy"
      style={({ hovered }) => [
        styles.ctaButton,
        hovered && styles.ctaButtonHovered,
      ]}
      onPress={() => trackCTA("Review Strategy", "insights")}
    >
      <ThemedText style={styles.ctaText}>{signalCardData.cta} →</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1A2236",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.15)",
    padding: 28,
    gap: 16,
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badge: {
    backgroundColor: "rgba(59, 130, 246, 0.18)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: "#93C5FD",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },
  heading: {
    fontSize: 40,
    fontWeight: "300",
    color: "#FFFFFF",
    lineHeight: 64,
  },
  body: {
    fontSize: 20,
    color: "#D1D5DB",
    lineHeight: 32,
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
    marginVertical: 28,
  },
  ctaButton: {
    backgroundColor: "#2563EB",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  ctaButtonHovered: {
    backgroundColor: "#3B82F6",
    transform: [{ scale: 1.02 }],
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
});

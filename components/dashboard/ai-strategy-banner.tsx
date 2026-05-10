import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { type AIStrategy } from "@/constants/data";
import { useAnalytics } from "@/hooks/use-analytics";

type AIStrategyBannerProps = {
  data: AIStrategy;
};

export const AIStrategyBanner = memo(function AIStrategyBanner({
  data,
}: AIStrategyBannerProps) {
  const { trackCTA } = useAnalytics();

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2563eb"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.banner}
    >
      <View style={styles.badgeContainer}>
        <ThemedText style={styles.badgeText}>{data.badge}</ThemedText>
      </View>
      <ThemedText type="titleMD" style={styles.headline}>
        {data.headline}
      </ThemedText>
      <ThemedText style={styles.bodyText}>{data.body}</ThemedText>
      <View style={styles.ctaRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Execute Strategy"
          style={({ hovered }) => [
            styles.primaryButton,
            Platform.OS === "web" && hovered && styles.primaryButtonHovered,
          ]}
          onPress={() => trackCTA("Execute Strategy", "dashboard")}
        >
          <ThemedText style={styles.primaryButtonText}>
            {data.primaryCta}
          </ThemedText>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Review Audit"
          style={({ hovered }) => [
            styles.ghostButton,
            Platform.OS === "web" && hovered && styles.ghostButtonHovered,
          ]}
          onPress={() => trackCTA("Review Audit", "dashboard")}
        >
          <ThemedText style={styles.ghostButtonText}>
            {data.secondaryCta}
          </ThemedText>
        </Pressable>
      </View>
    </LinearGradient>
  );
});

const styles = StyleSheet.create({
  banner: {
    borderRadius: 12,
    paddingVertical: 36,
    paddingHorizontal: 36,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 450,
    minHeight: 0,
    justifyContent: "flex-start",
    gap: 16,
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
  },
  badgeContainer: {
    backgroundColor: "rgba(59, 130, 246, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  badgeText: {
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    lineHeight: 14,
  },
  headline: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "600",
    lineHeight: 40,
    marginBottom: 16,
    width: 600,
  },
  bodyText: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: 22,
    lineHeight: 32,
    marginBottom: 24,
    width: 500,
    fontWeight: "300",
  },
  ctaRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 2,
  },
  primaryButtonHovered: {
    backgroundColor: "#F3F4F6",
  },
  primaryButtonText: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20,
  },
  ghostButton: {
    backgroundColor: "#496082",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 2,
  },
  ghostButtonHovered: {
    backgroundColor: "#5a7099",
  },
  ghostButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 20,
  },
});

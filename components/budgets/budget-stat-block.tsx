import { LinearGradient } from "expo-linear-gradient";
import { Platform, Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { budgetStrategy } from "@/constants/data";
import { useAnalytics } from "@/hooks/use-analytics";
import Animated, { FadeInDown } from "react-native-reanimated";

interface BudgetStatBlockProps {
  label: string;
  value: string;
  accentColor: string;
  delay?: number;
}

export function BudgetStatBlock({
  label,
  value,
  accentColor,
  delay = 200,
}: BudgetStatBlockProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(500)}
      style={styles.container as ViewStyle}
    >
      <View
        style={
          [styles.accentBar, { backgroundColor: accentColor }] as ViewStyle[]
        }
      />
      <View style={styles.content as ViewStyle}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <ThemedText style={styles.value}>{value}</ThemedText>
      </View>
    </Animated.View>
  );
}

export function BudgetStrategyCard() {
  const { trackCTA } = useAnalytics();

  return (
    <Animated.View
      entering={FadeInDown.delay(400).duration(500)}
      style={styles.strategyWrapper as ViewStyle}
    >
      <LinearGradient
        colors={["#1a3a8f", "#2563eb"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.strategyCard as ViewStyle}
      >
        <View style={styles.strategyHeader as ViewStyle}>
          <ThemedText style={styles.strategyLabel}>BUDGET STRATEGY</ThemedText>
        </View>

        <ThemedText style={styles.strategyHeading}>
          Optimize your spending to save{" "}
          <View style={styles.amountChip as ViewStyle}>
            <ThemedText style={styles.amountChipText}>
              {budgetStrategy.highlightedAmount}
            </ThemedText>
          </View>{" "}
          next month.
        </ThemedText>

        <ThemedText style={styles.strategyBody}>
          {budgetStrategy.body}
        </ThemedText>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Apply Strategy"
          style={({ hovered }: { hovered?: boolean }) => [
            styles.ctaButton as ViewStyle,
            hovered ? (styles.ctaButtonHovered as ViewStyle) : undefined,
          ]}
          onPress={() => trackCTA("Apply Strategy", "budgets")}
        >
          <ThemedText style={styles.ctaText}>Apply Strategy</ThemedText>
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "stretch",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#161E2E",
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
  },
  accentBar: {
    width: 4,
  },
  content: {
    flex: 1,
    paddingVertical: 34,
    paddingHorizontal: 32,
    gap: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: "#6B7280",
  },
  value: {
    fontSize: 32,
    fontWeight: "400",
    color: "#FFFFFF",
  },
  strategyWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  strategyCard: {
    borderRadius: 16,
    padding: 20,
    gap: 14,
    paddingHorizontal: 36,
    paddingVertical: 48,
  },
  strategyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  strategyLabel: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 1.5,
    color: "rgba(255, 255, 255, 0.9)",
  },
  strategyHeading: {
    fontSize: 28,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 36,
  },
  amountChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  amountChipText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 22,
  },
  strategyBody: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 22,
    paddingVertical: 16,
  },
  ctaButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    paddingVertical: 16,
    alignItems: "center",
  },
  ctaButtonHovered: {
    backgroundColor: "#F3F4F6",
  },
  ctaText: {
    color: "#2563EB",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
});

import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol, type IconSymbolName } from "@/components/ui/icon-symbol";
import Animated, { FadeInDown } from "react-native-reanimated";

type CategoryStatus = "healthy" | "warning" | "critical" | "fixed";

interface NormalizedCategory {
  id: string;
  name: string;
  icon: string;
  limit: number;
  spent: number;
  percent: number;
  status: CategoryStatus;
}

const BAR_COLORS: Record<CategoryStatus, string> = {
  healthy: "#10B981",
  warning: "#F59E0B",
  critical: "#EF4444",
  fixed: "#6B7280",
};

const BADGE_COLORS: Record<CategoryStatus, { bg: string; text: string }> = {
  healthy: { bg: "rgba(16, 185, 129, 0.15)", text: "#34D399" },
  warning: { bg: "rgba(245, 158, 11, 0.15)", text: "#FBBF24" },
  critical: { bg: "rgba(239, 68, 68, 0.15)", text: "#F87171" },
  fixed: { bg: "rgba(107, 114, 128, 0.15)", text: "#9CA3AF" },
};

const BADGE_LABELS: Record<CategoryStatus, string> = {
  healthy: "HEALTHY",
  warning: "WARNING",
  critical: "CRITICAL",
  fixed: "FIXED",
};

interface CategoryCardProps {
  category: NormalizedCategory;
  index: number;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const barColor = BAR_COLORS[category.status];
  const badge = BADGE_COLORS[category.status];
  const badgeLabel = BADGE_LABELS[category.status];

  return (
    <Animated.View
      entering={FadeInDown.delay(200 + index * 80).duration(500)}
      style={styles.card}
    >
      <View style={styles.cardTop}>
        <View style={styles.iconBox}>
          <IconSymbol
            name={category.icon as IconSymbolName}
            size={20}
            color="#9BA1A6"
          />
        </View>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <ThemedText style={[styles.badgeText, { color: badge.text }]}>
            {badgeLabel}
          </ThemedText>
        </View>
      </View>

      <ThemedText style={styles.categoryName}>{category.name}</ThemedText>

      <View style={styles.amountRow}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <ThemedText style={styles.spent}>
            ₹
            {category.spent.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}
          </ThemedText>
          <ThemedText style={styles.limit}>
            {" "}
            / ₹{category.limit.toLocaleString("en-IN")}
          </ThemedText>
        </View>
        <ThemedText style={styles.percentText}>
          <ThemedText style={[styles.percentValue, { color: barColor }]}>
            {category.percent}%
          </ThemedText>
        </ThemedText>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${category.percent}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0c0e0e",
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 16,
    gap: 20,
    width: "48%",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(51, 65, 85, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: "400",
    color: "#FFFFFF",
    marginTop: 4,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  spent: {
    fontSize: 16,
    fontWeight: "300",
    color: "#FFFFFF",
  },
  limit: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  percentText: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  percentValue: {
    fontWeight: "700",
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2A2D2D",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
});

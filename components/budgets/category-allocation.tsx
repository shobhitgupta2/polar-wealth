import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import useFetch from "@/hooks/use-fetch";
import Animated, { FadeInDown } from "react-native-reanimated";
import { CategoryCard } from "./category-card";

const API_URL =
  "https://shobhit-brightmoney.proxy.beeceptor.com/category-allocation";

type CategoryStatus = "healthy" | "warning" | "critical" | "fixed";

interface RawCategory {
  category: string;
  limit: number;
  spent: number;
  fixed: boolean;
}

interface NormalizedCategory {
  id: string;
  name: string;
  icon: string;
  limit: number;
  spent: number;
  percent: number;
  status: CategoryStatus;
}

const CATEGORY_META: Record<string, { icon: string; label: string }> = {
  housing: { icon: "house.fill", label: "Housing" },
  groceries: { icon: "fork.knife", label: "Groceries" },
  entertainment: { icon: "bag.fill", label: "Entertainment" },
  transport: { icon: "car", label: "Transport" },
};

const STATUS_THRESHOLDS = {
  entertainment: { warning: 60, critical: 80 },
  transport: { warning: 70, critical: 90 },
  groceries: { warning: 70, critical: 90 },
} as const satisfies Record<string, { warning: number; critical: number }>;

function deriveStatus(
  category: string,
  percent: number,
  fixed: boolean,
): CategoryStatus {
  if (fixed) return "fixed";
  const thresholds =
    STATUS_THRESHOLDS[category as keyof typeof STATUS_THRESHOLDS];
  if (!thresholds) return "healthy";
  if (percent > thresholds.critical) return "critical";
  if (percent > thresholds.warning) return "warning";
  return "healthy";
}

function normalize(raw: RawCategory): NormalizedCategory {
  const percent = Math.min(Math.round((raw.spent / raw.limit) * 100), 100);
  const status = deriveStatus(raw.category, percent, raw.fixed);
  const meta = CATEGORY_META[raw.category] ?? {
    icon: "creditcard.fill",
    label: raw.category,
  };

  return {
    id: raw.category,
    name: meta.label,
    icon: meta.icon,
    limit: raw.limit,
    spent: raw.spent,
    percent,
    status,
  };
}

export function CategoryAllocation() {
  const { data, isLoading, isError } = useFetch<RawCategory[]>(API_URL);

  const categories = (data ?? []).map(normalize);

  return (
    <Animated.View
      entering={FadeInDown.delay(300).duration(500)}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText style={styles.title}>Category Allocation</ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View All Categories"
          onPress={() => console.log("View All Categories")}
        >
          <ThemedText style={styles.viewAll}>View All Categories</ThemedText>
        </Pressable>
      </View>

      {isLoading && (
        <ThemedText style={styles.stateText}>Loading categories...</ThemedText>
      )}

      {isError && (
        <ThemedText style={[styles.stateText, { color: "#EF4444" }]}>
          Failed to load categories.
        </ThemedText>
      )}

      {!isLoading && !isError && (
        <View style={styles.grid}>
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "500",
    color: "#FFFFFF",
    paddingVertical: 16,
  },
  viewAll: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
    paddingHorizontal: 6,
  },
  stateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    paddingVertical: 24,
  },
});

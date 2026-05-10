import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import useFetch from "@/hooks/use-fetch";
import Animated, { FadeInDown } from "react-native-reanimated";

const TRACK_COLOR = "#2A2D2D";
const FILL_COLOR = "#3B82F6";

const API_URL =
  "https://shobhit-brightmoney.proxy.beeceptor.com/budget-velocity";

interface BudgetVelocityData {
  spent: number;
  limit: number;
}

function formatINR(amount: number): string {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function BudgetVelocityCard() {
  const { data, isLoading, isError } = useFetch<BudgetVelocityData>(API_URL);

  const daysRemaining = (() => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const diffMs = nextMonth.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  })();

  const spent = data?.spent ?? 0;
  const limit = data?.limit ?? 0;
  const percent =
    limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;

  if (isLoading) {
    return (
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        style={styles.card}
      >
        <ThemedText style={styles.label}>TOTAL BUDGET VELOCITY</ThemedText>
        <ThemedText style={styles.metaLeft}>Loading...</ThemedText>
      </Animated.View>
    );
  }

  if (isError) {
    return (
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        style={styles.card}
      >
        <ThemedText style={styles.label}>TOTAL BUDGET VELOCITY</ThemedText>
        <ThemedText style={[styles.metaLeft, { color: "#EF4444" }]}>
          Failed to load budget data.
        </ThemedText>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(500)}
      style={styles.card}
    >
      <ThemedText style={styles.label}>TOTAL BUDGET VELOCITY</ThemedText>

      <View style={styles.amountRow}>
        <ThemedText style={styles.spent}>₹{formatINR(spent)}</ThemedText>
        <ThemedText style={styles.divider}> / </ThemedText>
        <ThemedText style={styles.limit}>₹{formatINR(limit)}</ThemedText>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>

      <View style={styles.metaRow}>
        <ThemedText style={styles.metaLeft}>
          {percent}% of monthly limit reached
        </ThemedText>
        <ThemedText style={styles.metaRight}>
          {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} remaining
        </ThemedText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0c0e0e",
    borderRadius: 16,
    padding: 24,
    gap: 24,
    marginBottom: 24,
    paddingVertical: 56,
    paddingHorizontal: 36,
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1.5,
    color: "#3B82F6",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  spent: {
    fontSize: 52,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 48,
  },
  divider: {
    fontSize: 24,
    color: "#6B7280",
    fontWeight: "300",
  },
  limit: {
    fontSize: 20,
    color: "#6B7280",
    fontWeight: "400",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: TRACK_COLOR,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: FILL_COLOR,
    borderRadius: 5,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaLeft: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  metaRight: {
    fontSize: 16,
    color: "#3B82F6",
    fontWeight: "400",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
});

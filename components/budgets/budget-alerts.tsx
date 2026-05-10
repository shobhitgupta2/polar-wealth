import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { BudgetAlertItem } from "@/constants/data";
import useFetch from "@/hooks/use-fetch";
import Animated, { FadeInDown } from "react-native-reanimated";

const ALERT_COLORS: Record<BudgetAlertItem["type"], string> = {
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#6B7280",
};

const API_URL = "https://shobhit-brightmoney.proxy.beeceptor.com/budget-alerts";

function formatTimestamp(iso: string): string {
  const now = new Date();
  const date = new Date(iso);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMinutes < 60) {
    const minutes = Math.floor(diffMinutes);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (diffHours < 24) {
    const hours = Math.floor(diffHours);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  if (diffDays < 2) {
    return "Yesterday";
  }

  const days = Math.floor(diffDays);
  return `${days} days ago`;
}

export function BudgetAlerts() {
  const {
    data: budgetAlerts,
    isLoading,
    isError,
  } = useFetch<BudgetAlertItem[]>(API_URL);

  return (
    <Animated.View
      entering={FadeInDown.delay(500).duration(500)}
      style={styles.container}
    >
      <ThemedText style={styles.header}>⚠️ RECENT ALERTS</ThemedText>

      {isLoading && <ActivityIndicator color="#F59E0B" />}

      {isError && (
        <ThemedText style={styles.errorText}>Failed to load alerts.</ThemedText>
      )}

      {budgetAlerts && (
        <View style={styles.alertsList}>
          {budgetAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertRow}>
              <View
                style={[
                  styles.alertBar,
                  { backgroundColor: ALERT_COLORS[alert.type] },
                ]}
              />
              <View style={styles.alertContent}>
                <View style={styles.alertTop}>
                  <ThemedText style={styles.alertTitle}>
                    {alert.title}
                  </ThemedText>
                  <ThemedText
                    style={[
                      styles.alertTimestamp,
                      { color: ALERT_COLORS[alert.type] },
                    ]}
                  >
                    {formatTimestamp(alert.timestamp)}
                  </ThemedText>
                </View>
                <ThemedText style={styles.alertDescription}>
                  {alert.description}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 36,
    backgroundColor: "#0c0e0e",
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 32,
    paddingVertical: 44,
    borderRadius: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1.5,
    color: "white",
  },
  alertsList: {
    gap: 20,
  },
  alertRow: {
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
  },
  alertBar: {
    width: 4,
  },
  alertContent: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 4,
  },
  alertTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  alertTimestamp: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  alertDescription: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
  errorText: {
    fontSize: 13,
    color: "#EF4444",
    textAlign: "center",
  },
});

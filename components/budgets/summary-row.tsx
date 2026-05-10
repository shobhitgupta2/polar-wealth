import { SummaryItem } from "@/constants/data";
import useFetch from "@/hooks/use-fetch";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SummaryCard } from "../dashboard/summary-card";

const DASHBOARD_HIGHLIGHTS_URL =
  "https://shobhit-brightmoney.proxy.beeceptor.com/dashboard-highlights";

export function SummaryRow() {
  const { data, isLoading, isError } = useFetch<SummaryItem[]>(
    DASHBOARD_HIGHLIGHTS_URL,
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load summary</Text>
      </View>
    );
  }

  return (
    <View style={styles.summaryRow}>
      {data.map((item) => (
        <SummaryCard
          key={item.label}
          label={item.label}
          value={item.value}
          change={item.change}
          status={item.status}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
  },
});

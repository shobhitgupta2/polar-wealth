import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  formatCurrency,
  type SummaryChange,
  type SummaryStatus,
} from "@/constants/data";
import { Colors } from "@/constants/theme";

type SummaryCardProps = {
  label: string;
  value: number;
  change?: SummaryChange;
  status?: SummaryStatus;
};

type CardContentProps = {
  label: string;
  value: number;
  change?: SummaryChange;
  status?: SummaryStatus;
  indicatorColor: string;
};

function CardContent({
  label,
  value,
  change,
  status,
  indicatorColor,
}: CardContentProps) {
  return (
    <View style={styles.content}>
      <ThemedText type="labelSM" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedText type="displayMD" style={styles.value}>
        {formatCurrency(value)}
      </ThemedText>
      {change && (
        <View style={styles.indicatorRow}>
          <IconSymbol
            name={change.trend === "up" ? "arrow.up.right" : "chevron.right"}
            size={14}
            color={indicatorColor}
          />
          <ThemedText style={[styles.indicatorText, { color: indicatorColor }]}>
            {change.trend === "up" ? "+" : change.trend === "down" ? "-" : ""}
            {change.value}% {change.label}
          </ThemedText>
        </View>
      )}
      {status && (
        <View style={styles.indicatorRow}>
          <IconSymbol
            name="checkmark.circle.fill"
            size={14}
            color={indicatorColor}
          />
          <ThemedText style={[styles.indicatorText, { color: indicatorColor }]}>
            {status.text}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

export function SummaryCard({
  label,
  value,
  change,
  status,
}: SummaryCardProps) {
  const indicatorColor = change
    ? change.color
    : status?.variant === "success"
      ? Colors.dark.success
      : status?.variant === "warning"
        ? Colors.dark.warning
        : Colors.dark.error;

  return (
    <ThemedView
      lightColor={Colors.light.surfaceCard}
      darkColor="#0C0E0E"
      style={styles.card}
    >
      <CardContent
        label={label}
        value={value}
        change={change}
        status={status}
        indicatorColor={indicatorColor}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 4,
    flex: 1,
    minHeight: 200,
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 36,
    paddingHorizontal: 36,
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
  },
  content: {
    alignItems: "flex-start",
  },
  label: {
    color: Colors.dark.icon,
    letterSpacing: 1,
    marginBottom: 16,
    fontSize: 14,
  },
  value: {
    color: Colors.dark.text,
    marginBottom: 28,
    fontWeight: "300",
    fontSize: 64,
  },
  indicatorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  indicatorText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
});

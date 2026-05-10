import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol, type IconSymbolName } from "@/components/ui/icon-symbol";
import { type AlertItem, type AlertType } from "@/constants/data";
import { Colors } from "@/constants/theme";
import useFetch from "@/hooks/use-fetch";
import Animated, { FadeInDown } from "react-native-reanimated";

// Shape returned by the API
interface AlertApiItem {
  id: string;
  title: string;
  description: string;
  status: AlertType;
}

const alertConfig: Record<
  AlertType,
  { barColor: string; iconBg: string; iconColor: string; icon: IconSymbolName }
> = {
  error: {
    barColor: Colors.dark.error,
    iconBg: "rgba(186, 26, 26, 0.85)",
    iconColor: "#ffffff",
    icon: "exclamationmark.triangle.fill",
  },
  warning: {
    barColor: "#f59e0b",
    iconBg: "rgba(180, 120, 40, 0.7)",
    iconColor: "#fbbf24",
    icon: "exclamationmark.triangle.fill",
  },
  info: {
    barColor: "#6366f1",
    iconBg: "rgba(99, 102, 241, 0.35)",
    iconColor: "#818cf8",
    icon: "chart.bar.fill",
  },
};

export function ActiveAlerts() {
  const { data, isLoading, isError } = useFetch<AlertApiItem[]>(
    "https://69fee8ad8c70b15fa3cad962.mockapi.io/api/alerts",
  );

  // Map API shape → internal AlertItem shape
  const alerts: AlertItem[] = (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    body: item.description,
    type: item.status,
  }));

  return (
    <View style={styles.container}>
      <ThemedText type="titleMD" style={styles.sectionTitle}>
        Active Alerts
      </ThemedText>

      {isLoading && (
        <ActivityIndicator
          color={Colors.dark.text}
          style={styles.centeredFeedback}
        />
      )}

      {isError && (
        <ThemedText style={[styles.centeredFeedback, styles.errorText]}>
          Failed to load alerts.
        </ThemedText>
      )}

      {!isLoading && !isError && (
        <View style={styles.alertsList}>
          {alerts.map((alert, index) => {
            const config = alertConfig[alert.type];
            return (
              <Animated.View
                key={alert.id}
                style={styles.alertCard}
                entering={FadeInDown.delay(index * 120).duration(500)}
              >
                <View
                  style={[
                    styles.alertBar,
                    { backgroundColor: config.barColor },
                  ]}
                />
                <View style={styles.alertInner}>
                  <View
                    style={[
                      styles.alertIconBox,
                      { backgroundColor: config.iconBg },
                    ]}
                  >
                    <IconSymbol
                      name={config.icon}
                      size={16}
                      color={config.iconColor}
                    />
                  </View>
                  <View style={styles.alertContent}>
                    <ThemedText style={styles.alertTitle}>
                      {alert.title}
                    </ThemedText>
                    <ThemedText style={styles.alertBody}>
                      {alert.body}
                    </ThemedText>
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 20,
    flex: 2,
    minHeight: 220,
  },
  sectionTitle: {
    color: Colors.dark.text,
    marginBottom: 14,
    fontWeight: "200",
    fontSize: 24,
    paddingBottom: 24,
  },
  centeredFeedback: {
    marginTop: 32,
    alignSelf: "center",
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 14,
  },
  alertsList: {
    gap: 36,
  },
  alertCard: {
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: "#0C0E0E",
    overflow: "hidden",
    minHeight: 110,
    maxWidth: 360,
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
  },
  alertBar: {
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  alertInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 12,
  },
  alertIconBox: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  alertContent: {
    flex: 1,
    gap: 4,
  },
  alertTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 26,
  },
  alertBody: {
    color: Colors.dark.icon,
    fontSize: 14,
    lineHeight: 22,
    flexShrink: 1,
  },
});

import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export function InsightsHeader() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>THE WEALTH CURATOR</ThemedText>
      <ThemedText style={styles.heading}>Market Intelligence</ThemedText>
      <ThemedText style={styles.subtext}>
        Your personalized financial editorial, synthesized from real-time market
        data and your unique capital allocation.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#4A7FE5",
    marginBottom: 8,
  },
  heading: {
    fontSize: 48,
    fontWeight: "500",
    color: "#FFFFFF",
    lineHeight: 52,
    marginBottom: 12,
  },
  subtext: {
    fontSize: 20,
    color: "#9CA3AF",
    lineHeight: 28,
    maxWidth: 560,
  },
});

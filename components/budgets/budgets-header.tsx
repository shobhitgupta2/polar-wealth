import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export function BudgetsHeader() {
  const fiscalPeriod = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <ThemedText style={styles.heading}>Monthly Overview</ThemedText>
        <ThemedText style={styles.subtitle}>
          Fiscal Period: {fiscalPeriod}
        </ThemedText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Adjust Limits"
        style={({ hovered }: { hovered?: boolean }) => [
          styles.ctaButton,
          hovered && styles.ctaButtonHovered,
        ]}
        onPress={() => console.log("Adjust Limits")}
      >
        <ThemedText style={styles.ctaText}>+ Adjust Limits</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  left: {
    gap: 24,
  },
  heading: {
    fontSize: 56,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "400",
  },
  ctaButton: {
    backgroundColor: "#2563EB",
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignSelf: "flex-end",
  },
  ctaButtonHovered: {
    backgroundColor: "#3B82F6",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "400",
  },
});

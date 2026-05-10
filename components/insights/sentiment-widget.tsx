import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { sentimentData } from "@/constants/data";
import { memo } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SentimentGauge } from "./sentiment-gauge";

export const SentimentWidget = memo(function SentimentWidget() {
  return (
    <Animated.View
      entering={FadeInDown.delay(300).duration(500)}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText style={styles.sectionLabel}>Sentiment Index</ThemedText>
        <IconSymbol
          name="arrowtriangle.up.fill"
          size={12}
          color="#F59E0B"
          style={{ marginLeft: 4 }}
        />
      </View>
      <SentimentGauge delay={600} />
      <ThemedText style={styles.description}>
        {sentimentData.description}
      </ThemedText>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "",
    borderRadius: 16,
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flex: 1,
    borderColor: "#16181a",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  sectionLabel: {
    fontSize: 24,
    fontWeight: "400",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  description: {
    fontSize: 18,
    color: "#6B7280",
    lineHeight: 24,
    textAlign: "center",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
    paddingHorizontal: 8,
  },
});

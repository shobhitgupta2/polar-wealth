import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";

import { SummaryRow } from "@/components/budgets/summary-row";
import { ActiveAlerts } from "@/components/dashboard/active-alerts";
import { AIStrategyBanner } from "@/components/dashboard/ai-strategy-banner";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SpendingComposition } from "@/components/dashboard/spending-composition";
import { aiStrategy } from "@/constants/data";
import { useScrollTo } from "@/hooks/use-scroll-to";
import Animated, { FadeIn } from "react-native-reanimated";

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const showBottomRow = width >= 640;
  const scrollViewRef = useRef<ScrollView>(null);
  const { scrollTo, scrollNonce } = useLocalSearchParams();
  const { handleLayout } = useScrollTo({ scrollViewRef, scrollToParam: scrollTo, scrollNonce });

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View nativeID="summary-row" onLayout={handleLayout("summary-row")} role="region" aria-label="Portfolio summary">
        <SummaryRow />
      </View>
      <View
        role="region"
        aria-label="AI strategy and alerts"
        style={[styles.bottomRow, !showBottomRow && styles.bottomRowStacked]}
      >
        <View style={{ flex: 3 }}>
          <AIStrategyBanner data={aiStrategy} />
        </View>
        <View style={{ flex: 2, maxWidth: 420 }}>
          <ActiveAlerts />
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 64 }} role="region" aria-label="Spending and recent activity">
        <Animated.View style={{ flex: 4 }} entering={FadeIn.duration(1000)}>
          <SpendingComposition />
        </Animated.View>
        <View style={{ flex: 5 }}>
          <RecentActivity />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 16,
  },
  bottomRow: {
    flexDirection: "row",
    gap: 16,
  },
  bottomRowStacked: {
    flexDirection: "column",
  },
});
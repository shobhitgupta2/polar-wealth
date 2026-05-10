import { useLocalSearchParams } from "expo-router";
import { lazy, Suspense, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useScrollTo } from "@/hooks/use-scroll-to";
import { ImageBackground } from "expo-image";

const BudgetAlerts = lazy(() =>
  import("@/components/budgets/budget-alerts").then((m) => ({
    default: m.BudgetAlerts,
  })),
);
const BudgetHighlights = lazy(() =>
  import("@/components/budgets/budget-highlights").then((m) => ({
    default: m.BudgetHighlights,
  })),
);
const BudgetStrategyCard = lazy(() =>
  import("@/components/budgets/budget-stat-block").then((m) => ({
    default: m.BudgetStrategyCard,
  })),
);
const BudgetVelocityCard = lazy(() =>
  import("@/components/budgets/budget-velocity-card").then((m) => ({
    default: m.BudgetVelocityCard,
  })),
);
const BudgetsHeader = lazy(() =>
  import("@/components/budgets/budgets-header").then((m) => ({
    default: m.BudgetsHeader,
  })),
);
const CategoryAllocation = lazy(() =>
  import("@/components/budgets/category-allocation").then((m) => ({
    default: m.CategoryAllocation,
  })),
);

export default function BudgetsScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { scrollTo, scrollNonce } = useLocalSearchParams();
  const { handleLayout } = useScrollTo({
    scrollViewRef,
    scrollToParam: scrollTo,
    scrollNonce,
  });

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Suspense fallback={null}>
          <BudgetsHeader />
        </Suspense>

        <View style={styles.columnsRow}>
          <View style={styles.leftColumn} role="region" aria-label="Budget velocity and category allocation">
            <View
              nativeID="budget-velocity"
              onLayout={handleLayout("budget-velocity")}
            >
              <Suspense fallback={null}>
                <BudgetVelocityCard />
              </Suspense>
            </View>
            <View
              nativeID="category-allocation"
              onLayout={handleLayout("category-allocation")}
            >
              <Suspense fallback={null}>
                <CategoryAllocation />
              </Suspense>
            </View>
          </View>

          <View style={styles.rightColumn} role="region" aria-label="Budget highlights and strategy">
            <View
              nativeID="budget-highlights"
              onLayout={handleLayout("budget-highlights")}
            >
              <Suspense fallback={null}>
                <BudgetHighlights />
              </Suspense>
            </View>
            <View
              nativeID="budget-strategy"
              onLayout={handleLayout("budget-strategy")}
            >
              <Suspense fallback={null}>
                <BudgetStrategyCard />
              </Suspense>
            </View>
            <View
              nativeID="budget-alerts"
              onLayout={handleLayout("budget-alerts")}
            >
              <Suspense fallback={null}>
                <BudgetAlerts />
              </Suspense>
            </View>
            <ImageBackground
              source={require("@/assets/images/laptop-gold-coins.jpeg")}
              style={{ width: "100%", height: 250 }}
              accessibilityLabel="Institutional growth quarterly report"
            >
              <Pressable
                style={{
                  width: "100%",
                  height: "100%",
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <ThemedText style={{ fontSize: 30, fontWeight: "600" }}>
                  Institutional Growth
                </ThemedText>
                <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
                  QUARTERLY REPORT READY
                </ThemedText>
              </Pressable>
            </ImageBackground>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 24,
  },
  columnsRow: {
    flexDirection: "row",
    gap: 24,
    alignItems: "flex-start",
  },
  leftColumn: {
    flex: 0.65,
  },
  rightColumn: {
    gap: 16,
    flex: 0.35,
  },
});

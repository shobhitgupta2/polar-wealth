import {
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";

import { ActiveSignalCard } from "@/components/insights/active-signal-card";
import { InsightsHeader } from "@/components/insights/insights-header";
import { PortfolioSectors } from "@/components/insights/portfolio-sectors";
import { PortfolioVelocityChart } from "@/components/insights/portfolio-velocity";
import { RealEstateCard } from "@/components/insights/real-estate";
import { SentimentWidget } from "@/components/insights/sentiment-widget";
import { SpendingIntelligence } from "@/components/insights/spending-intelligence";
import { useScrollTo } from "@/hooks/use-scroll-to";

export default function InsightsScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { scrollTo, scrollNonce } = useLocalSearchParams();
  const { handleLayout } = useScrollTo({ scrollViewRef, scrollToParam: scrollTo, scrollNonce });

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.content}>
        <InsightsHeader />
        <View style={styles.columnsRow} role="region" aria-label="Active signal and market sentiment">
          <View style={styles.leftColumn} nativeID="active-signal" onLayout={handleLayout("active-signal")}>
            <ActiveSignalCard />
          </View>
          <View style={styles.rightColumn} nativeID="sentiment-widget" onLayout={handleLayout("sentiment-widget")}>
            <SentimentWidget />
          </View>
        </View>
        <View nativeID="portfolio-velocity" onLayout={handleLayout("portfolio-velocity")} role="region" aria-label="Portfolio velocity chart">
          <PortfolioVelocityChart />
        </View>
        <View style={[styles.columnsRow, { paddingBottom: 24 }]} role="region" aria-label="Sector allocation and spending intelligence">
          <View style={styles.halfColumn}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 56,
              }}
            >
              <View nativeID="portfolio-sectors" onLayout={handleLayout("portfolio-sectors")}>
                <PortfolioSectors />
              </View>
              <View nativeID="real-estate" onLayout={handleLayout("real-estate")}>
                <RealEstateCard />
              </View>
            </View>
          </View>
          <View style={styles.halfColumn} nativeID="spending-intelligence" onLayout={handleLayout("spending-intelligence")}>
            <SpendingIntelligence />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    gap: 44,
  },
  columnsRow: {
    flexDirection: "row",
    gap: 24,
    alignItems: "stretch",
  },
  leftColumn: {
    flex: 0.65,
  },
  rightColumn: {
    flex: 0.35,
  },
  halfColumn: {
    flex: 1,
  },
});
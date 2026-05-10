import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import {
    Area,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    type TooltipProps,
} from "recharts";
import type {
    NameType,
    ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { ThemedText } from "@/components/themed-text";
import useFetch from "@/hooks/use-fetch";

// ─── Types ────────────────────────────────────────────────────────────────────

type TimeRange = "1W" | "1M" | "1Y" | "ALL";

interface DataPoint {
  t: number;
  portfolio: number;
  sp500: number;
}

type PortfolioVelocityResponse = Record<TimeRange, DataPoint[]>;

const PORTFOLIO_VELOCITY_URL =
  "https://shobhit-brightmoney.proxy.beeceptor.com/portfolio-velocity";

const TIME_RANGES: TimeRange[] = ["1W", "1M", "1Y", "ALL"];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function PeakTooltip(props: TooltipProps<ValueType, NameType>) {
  const { active, payload } = props as any;
  if (!active || !payload?.length) return null;
  const portfolio = payload.find(
    (p: { dataKey?: string | number }) => p.dataKey === "portfolio",
  );
  if (!portfolio?.value) return null;
  const formatted = `₹${Number(portfolio.value).toLocaleString()}`;
  return (
    <View style={tooltipStyles.box}>
      <ThemedText style={tooltipStyles.label}>PORTFOLIO VALUE</ThemedText>
      <ThemedText style={tooltipStyles.value}>{formatted}</ThemedText>
    </View>
  );
}

const tooltipStyles = StyleSheet.create({
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1.2,
    marginBottom: 4,
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
});

// ─── Main Component ───────────────────────────────────────────────────────────

export function PortfolioVelocityChart() {
  const [activeRange, setActiveRange] = useState<TimeRange>("1M");

  const { data, isLoading, isError } = useFetch<PortfolioVelocityResponse>(
    PORTFOLIO_VELOCITY_URL,
  );

  const currentData = data?.[activeRange] ?? [];

  const peakValue = useMemo(() => {
    if (!currentData.length) return null;
    const peak = Math.max(...currentData.map((d) => d.portfolio));
    return `₹${peak.toLocaleString()}`;
  }, [currentData]);

  return (
    <Animated.View
      entering={FadeInDown.delay(450).duration(500)}
      style={styles.card}
    >
      {/* ── Header ── */}
      <View style={styles.headerRow}>
        <View>
          <ThemedText style={styles.title}>Portfolio Velocity</ThemedText>
          <ThemedText style={styles.subtitle}>
            Comparison vs. S&P 500 Benchmarks
          </ThemedText>
        </View>

        <View style={styles.tabRow}>
          {TIME_RANGES.map((r) => (
            <Pressable
              key={r}
              accessibilityRole="tab"
              aria-selected={activeRange === r}
              accessibilityLabel={`Time range: ${r}`}
              style={[styles.tab, activeRange === r && styles.tabActive]}
              onPress={() => setActiveRange(r)}
            >
              <ThemedText
                style={[
                  styles.tabText,
                  activeRange === r && styles.tabTextActive,
                ]}
              >
                {r}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Peak badge ── */}
      <View style={styles.peakRow}>
        <View style={styles.peakBadge}>
          <ThemedText style={styles.peakLabel}>PEAK PERFORMANCE</ThemedText>
          <ThemedText style={styles.peakValue}>
            {isLoading ? "—" : (peakValue ?? "—")}
          </ThemedText>
        </View>
      </View>

      {/* ── Chart ── */}
      <View style={styles.chartWrapper}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#3B82F6" />
          </View>
        ) : isError || !data ? (
          <View style={styles.centered}>
            <ThemedText style={styles.errorText}>
              Failed to load chart data
            </ThemedText>
          </View>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart
              data={currentData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <Tooltip
                content={<PeakTooltip />}
                cursor={{
                  stroke: "rgba(59,130,246,0.25)",
                  strokeWidth: 1,
                  strokeDasharray: "4 3",
                }}
              />

              <Line
                type="monotone"
                dataKey="sp500"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="6 5"
                dot={false}
                activeDot={false}
                opacity={0.75}
              />

              <Area
                type="monotone"
                dataKey="portfolio"
                stroke="#3B82F6"
                strokeWidth={2.5}
                fill="url(#portfolioGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "#3B82F6",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </View>

      {/* ── Legend ── */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#3B82F6" }]} />
          <ThemedText style={styles.legendText}>Your Portfolio</ThemedText>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendDash} />
          <ThemedText style={styles.legendText}>S&P 500</ThemedText>
        </View>
      </View>
    </Animated.View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.12)",
    padding: 24,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  tabRow: {
    flexDirection: "row",
    gap: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  peakRow: {
    marginBottom: 8,
  },
  peakBadge: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  peakLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 1.2,
    marginBottom: 2,
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  peakValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
  chartWrapper: {
    marginHorizontal: -8,
    height: 240,
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
  legend: {
    flexDirection: "row",
    gap: 20,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendDash: {
    width: 18,
    height: 2,
    backgroundColor: "#F59E0B",
    borderRadius: 1,
    opacity: 0.8,
  },
  legendText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: Platform.OS === "web" ? "'Sora', sans-serif" : undefined,
  },
});

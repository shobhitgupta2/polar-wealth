import useFetch from "@/hooks/use-fetch";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const COLORS = {
  card: "#151d2e",
  cardAlt: "#1a2336",
  blue: "#4a9eff",
  green: "#22c55e",
  textPrimary: "#e8edf5",
  textSecondary: "#6b7a99",
  border: "#1e2d45",
};

const REAL_ESTATE_URL =
  "https://shobhit-brightmoney.proxy.beeceptor.com/real-estate";

// ─── Types ────────────────────────────────────────────────────────────────────

type RealEstateData = {
  diversification: string;
  percentage: string;
  return: string;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function RealEstateCard() {
  const { data, isLoading, isError } =
    useFetch<RealEstateData>(REAL_ESTATE_URL);

  const parsed: RealEstateData | null = (() => {
    if (!data) return null;
    return typeof data === "string" ? JSON.parse(data) : data;
  })();

  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>◑</Text>
        </View>
        <View style={styles.labelGroup}>
          <Text style={styles.title}>Real Estate</Text>
          <Text style={styles.subtitle}>
            Diversification Score:{" "}
            {isLoading ? "—" : (parsed?.diversification ?? "—")}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        {isLoading ? (
          <ActivityIndicator color={COLORS.blue} size="small" />
        ) : isError || !parsed ? (
          <Text style={styles.errorText}>—</Text>
        ) : (
          <>
            <Text style={styles.percentage}>{parsed.percentage}%</Text>
            <Text style={styles.mom}>+{parsed.return}% MoM</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#16181a",
    flex: 0.3,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.cardAlt,
    borderWidth: 1,
    borderColor: COLORS.blue + "44",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 20,
    color: COLORS.blue,
  },
  labelGroup: {
    gap: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  percentage: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  mom: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.green,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
});

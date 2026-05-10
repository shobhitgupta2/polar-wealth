import useFetch from "@/hooks/use-fetch";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { AccessiblePressable } from "../ui/accessible-pressable";
import { IconSymbol } from "../ui/icon-symbol";

const COLORS = {
  bg: "#0f1520",
  card: "#151d2e",
  cardAlt: "#1a2336",
  blue: "#4a9eff",
  orange: "#f59e0b",
  textPrimary: "#e8edf5",
  textSecondary: "#6b7a99",
  border: "#1e2d45",
};

const SPENDING_INTELLIGENCE_URL =
  "https://shobhit-brightmoney.proxy.beeceptor.com/spending-intelligence";

// ─── Types ────────────────────────────────────────────────────────────────────

type SpendingItem = {
  icon: string;
  iconColor: string;
  title: string;
  amount: number;
  subtitle: string;
};

type SpendingRowProps = {
  icon: string;
  iconColor: string;
  title: string;
  amount: string;
  subtitle: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpendingRow({
  icon,
  iconColor,
  title,
  amount,
  subtitle,
}: SpendingRowProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, { borderColor: iconColor + "33" }]}>
        <IconSymbol name={icon as any} color={iconColor} size={28} />
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={styles.rowTitle}>{title}</Text>
          <Text style={styles.rowAmount}>{amount}</Text>
        </View>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SpendingIntelligence() {
  const { data, isLoading, isError } = useFetch<SpendingItem[]>(
    SPENDING_INTELLIGENCE_URL,
  );

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Spending Intelligence</Text>

      <View style={styles.body}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={COLORS.blue} />
          </View>
        ) : isError || !data ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Failed to load spending data</Text>
          </View>
        ) : (
          data.map((item) => (
            <SpendingRow
              key={item.title}
              icon={item.icon}
              iconColor={item.iconColor}
              title={item.title}
              amount={`$${item.amount}/mo`}
              subtitle={item.subtitle}
            />
          ))
        )}
      </View>

      <AccessiblePressable
        style={styles.btn}
        accessibilityLabel="View All Efficiency Gains"
        onPress={() => console.log("View All Efficiency Gains")}
      >
        <Text style={styles.btnText}>View All Efficiency Gains</Text>
      </AccessiblePressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    gap: 20,
    height: 400,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  body: {
    paddingHorizontal: 24,
    flex: 1,
    flexDirection: "column",
    gap: 48,
    paddingTop: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#ef4444",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 32,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: COLORS.cardAlt,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "400",
    color: COLORS.textPrimary,
  },
  rowAmount: {
    fontSize: 15,
    fontWeight: "400",
    color: COLORS.textPrimary,
  },
  rowSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  btn: {
    marginTop: 4,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: COLORS.cardAlt,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
});

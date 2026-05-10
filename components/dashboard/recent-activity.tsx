import {
    ActivityIndicator,
    StyleSheet,
    View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { AccessiblePressable } from "@/components/ui/accessible-pressable";
import useFetch from "@/hooks/use-fetch";

// ─── Types ────────────────────────────────────────────────────────────────────

type TransactionStatus = "cleared" | "pending";

type CategoryVariant =
  | "technology"
  | "lifestyle"
  | "utilities"
  | "dining"
  | "transport"
  | "salary"
  | string;

type Transaction = {
  id: string;
  merchant: string;
  date: string;
  time: string;
  category: CategoryVariant;
  status: TransactionStatus;
  amount: number;
  type: "credit" | "debit";
};

interface TransactionApiItem {
  id: number;
  merchant: string;
  datetime: string;
  type: "credit" | "debit";
  amount: number;
  category: string;
  status: "cleared" | "pending";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAmount(amount: number, type: "credit" | "debit"): string {
  const abs = Math.abs(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return type === "credit" ? `+ ₹${abs}` : `₹${abs}`;
}

/** Convert UTC ISO string → IST date and time strings */
function utcToIST(isoString: string): { date: string; time: string } {
  // IST = UTC + 5:30
  const utcMs = new Date(isoString).getTime();
  const istMs = utcMs + 5.5 * 60 * 60 * 1000;
  const ist = new Date(istMs);

  const date = ist.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC", // already shifted manually
  });

  const time = ist.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  return { date, time };
}

function normalizeCategory(raw: string): CategoryVariant {
  const map: Record<string, CategoryVariant> = {
    dining: "dining",
    income: "salary",
    salary: "salary",
    utility: "utilities",
    utilities: "utilities",
    technology: "technology",
    transport: "transport",
    lifestyle: "lifestyle",
  };
  return map[raw.toLowerCase()] ?? raw.toLowerCase();
}

function mapApiItem(item: TransactionApiItem): Transaction {
  const { date, time } = utcToIST(item.datetime);
  return {
    id: String(item.id),
    merchant: item.merchant,
    date,
    time,
    category: normalizeCategory(item.category),
    status: item.status,
    amount: item.amount,
    type: item.type,
  };
}

// ─── Category colours (+ salary) ──────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  technology: { bg: "#3B82F6", text: "#fff" },
  lifestyle: { bg: "#F59E0B", text: "#fff" },
  utilities: { bg: "#6B7280", text: "#fff" },
  dining: { bg: "#EF4444", text: "#fff" },
  transport: { bg: "#8B5CF6", text: "#fff" },
  salary: { bg: "#16A34A", text: "#fff" },
};

function getCategoryStyle(variant: string) {
  return (
    CATEGORY_COLORS[variant.toLowerCase()] ?? { bg: "#6B7280", text: "#fff" }
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryBadge({ variant }: { variant: string }) {
  const { bg, text } = getCategoryStyle(variant);
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <ThemedText style={[styles.badgeText, { color: text }]}>
        {variant.toUpperCase()}
      </ThemedText>
    </View>
  );
}

function StatusIndicator({ status }: { status: TransactionStatus }) {
  const isCleared = status === "cleared";
  const color = isCleared ? Colors.dark.success : Colors.dark.tint;
  const label = isCleared ? "CLEARED" : "PENDING";
  return (
    <View style={styles.statusRow}>
      <View style={[styles.statusDot, { backgroundColor: color }]} />
      <ThemedText style={[styles.statusText, { color }]}>{label}</ThemedText>
    </View>
  );
}

function TransactionRow({
  merchant,
  date,
  time,
  category,
  status,
  amount,
  type,
}: Transaction) {
  const isCredit = type === "credit";
  const amountColor = isCredit ? "#4ADE80" : Colors.dark.text;

  return (
    <View style={styles.row}>
      {/* Merchant */}
      <View style={styles.merchantCell}>
        <View style={styles.merchantInfo}>
          <ThemedText type="bodyMD" style={styles.merchantName}>
            {merchant}
          </ThemedText>
          <ThemedText type="labelSM" style={styles.merchantDate}>
            {date} • {time}
          </ThemedText>
        </View>
      </View>

      {/* Category */}
      <View style={styles.categoryCell}>
        <CategoryBadge variant={category} />
      </View>

      {/* Status */}
      <View style={styles.statusCell}>
        <StatusIndicator status={status} />
      </View>

      {/* Amount */}
      <View style={styles.amountCell}>
        <ThemedText style={[styles.amount, { color: amountColor }]}>
          {formatAmount(amount, type)}
        </ThemedText>
      </View>
    </View>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function RecentActivity() {
  const { data, isLoading, isError } = useFetch<TransactionApiItem[]>(
    "https://shobhit-brightmoney.proxy.beeceptor.com/recent-activity",
  );

  const transactions: Transaction[] = (data ?? []).map(mapApiItem);

  return (
    <ThemedView darkColor="#0C0E0E" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Recent Activity</ThemedText>
        <View style={styles.headerActions}>
          <AccessiblePressable
            style={styles.actionBtn}
            accessibilityLabel="Export CSV"
            onPress={() => console.log("Export CSV")}
          >
            <ThemedText type="labelSM" style={styles.actionBtnText}>
              Export CSV
            </ThemedText>
          </AccessiblePressable>
          <AccessiblePressable
            style={styles.actionBtn}
            accessibilityLabel="Filter"
            onPress={() => console.log("Filter")}
          >
            <ThemedText type="labelSM" style={styles.actionBtnText}>
              Filter
            </ThemedText>
          </AccessiblePressable>
        </View>
      </View>

      {/* Column headings */}
      <View style={styles.columnHeaders}>
        <ThemedText
          type="labelSM"
          style={[styles.colLabel, styles.merchantCell]}
        >
          MERCHANT
        </ThemedText>
        <ThemedText
          type="labelSM"
          style={[styles.colLabel, styles.categoryCell]}
        >
          CATEGORY
        </ThemedText>
        <ThemedText type="labelSM" style={[styles.colLabel, styles.statusCell]}>
          STATUS
        </ThemedText>
        <ThemedText type="labelSM" style={[styles.colLabel, styles.amountCell]}>
          AMOUNT
        </ThemedText>
      </View>

      {/* States */}
      {isLoading && (
        <ActivityIndicator color={Colors.dark.text} style={styles.feedback} />
      )}
      {isError && (
        <ThemedText style={[styles.feedback, styles.errorText]}>
          Failed to load transactions.
        </ThemedText>
      )}

      {/* Rows */}
      {!isLoading && !isError && (
        <View style={styles.rows}>
          {transactions.map((tx, i) => (
            <View key={tx.id}>
              <TransactionRow {...tx} />
              {i < transactions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      )}
    </ThemedView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 24,
    gap: 16,
    flex: 1,
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: Colors.dark.text,
    fontWeight: "600",
    fontSize: 25,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#1E2121",
  },
  actionBtnText: {
    color: Colors.dark.text,
    letterSpacing: 0.3,
  },
  columnHeaders: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2D2D",
  },
  colLabel: {
    color: Colors.dark.icon,
    letterSpacing: 1.2,
    fontSize: 11,
  },
  rows: {
    gap: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#1E2121",
  },
  feedback: {
    marginTop: 24,
    alignSelf: "center",
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 14,
  },

  // ── Cells ──
  merchantCell: {
    flex: 2.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryCell: {
    flex: 1.6,
    alignItems: "flex-start",
  },
  statusCell: {
    flex: 1.4,
    alignItems: "flex-start",
  },
  amountCell: {
    flex: 1.2,
    alignItems: "flex-end",
  },

  // ── Merchant ──
  merchantInfo: {
    gap: 3,
  },
  merchantName: {
    color: Colors.dark.text,
    fontWeight: "600",
  },
  merchantDate: {
    color: Colors.dark.icon,
    fontSize: 12,
  },

  // ── Badge ──
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  // ── Status ──
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  // ── Amount ──
  amount: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

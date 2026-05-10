import useFetch from "@/hooks/use-fetch";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
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
  trackBg: "#1e2d45",
};

type SectorConfig = {
  icon: string;
  iconColor: string;
  barColor: string;
};

const SECTOR_CONFIG: Record<string, SectorConfig> = {
  Technology: {
    icon: "cpu",
    iconColor: COLORS.blue,
    barColor: COLORS.blue,
  },
  "ESG / Green": {
    icon: "leaf.fill",
    iconColor: COLORS.orange,
    barColor: COLORS.orange,
  },
};

type SectorData = {
  label: string;
  percentage: number;
};

type SectorBoxProps = SectorConfig & {
  label: string;
  percentage: number;
};

function SectorBox({
  icon,
  iconColor,
  label,
  percentage,
  barColor,
}: SectorBoxProps) {
  return (
    <View style={styles.box}>
      <View style={styles.labelRow}>
        <View style={[styles.iconWrap, { borderColor: iconColor + "33" }]}>
          <IconSymbol name={icon as any} color={iconColor} size={18} />
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.percentage}>{percentage}%</Text>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

export function PortfolioSectors() {
  const { data, isLoading, isError } = useFetch<SectorData[]>(
    "https://shobhit-brightmoney.proxy.beeceptor.com/portfolio-sectors",
  );

  if (isLoading) {
    return (
      <View style={[styles.row, styles.centered]}>
        <ActivityIndicator color={COLORS.blue} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={[styles.row, styles.centered]}>
        <Text style={styles.errorText}>Failed to load sectors</Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      {data.map((sector) => {
        const config = SECTOR_CONFIG[sector.label];
        if (!config) return null;
        return (
          <SectorBox
            key={sector.label}
            label={sector.label}
            percentage={sector.percentage}
            {...config}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 16,
    flex: 0.7,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  box: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#16181a",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: COLORS.cardAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
    paddingBottom: 12,
  },
  percentage: {
    fontSize: 36,
    fontWeight: "300",
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.trackBg,
    overflow: "hidden",
  },
  fill: {
    height: 8,
    borderRadius: 2,
  },
});

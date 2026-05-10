import useFetch from "@/hooks/use-fetch";
import { ActivityIndicator, View } from "react-native";
import { BudgetStatBlock } from "./budget-stat-block";

interface BudgetHighlightsData {
  projectedSurplus: number;
  savingsEfficiency: number;
}

const API_URL =
  "https://shobhit-brightmoney.proxy.beeceptor.com/budget-highlights";

export function BudgetHighlights() {
  const { data: budgetStats, isLoading } =
    useFetch<BudgetHighlightsData>(API_URL);

  if (isLoading || !budgetStats) return <ActivityIndicator color="#F59E0B" />;

  return (
    <View>
      <BudgetStatBlock
        label="PROJECTED SURPLUS"
        value={`+ ₹${budgetStats.projectedSurplus.toLocaleString("en-IN")}`}
        accentColor="#3B82F6"
        delay={200}
      />
      <BudgetStatBlock
        label="SAVINGS EFFICIENCY"
        value={`${budgetStats.savingsEfficiency}%`}
        accentColor="#F59E0B"
        delay={300}
      />
    </View>
  );
}

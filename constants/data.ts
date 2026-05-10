export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export type SummaryChange = {
  value: number;
  trend: "up" | "down" | "neutral";
  label: string;
  color: string;
};

export type SummaryStatus = {
  text: string;
  variant: "success" | "warning" | "error";
};

export type SummaryItem = {
  label: string;
  value: number;
  change?: SummaryChange;
  status?: SummaryStatus;
};

export const dashboardSummary: SummaryItem[] = [
  {
    label: "TOTAL NET WORTH",
    value: 1248500,
    change: {
      value: 12.4,
      trend: "up",
      label: "vs last month",
      color: "#10b981",
    },
  },
  {
    label: "MONTHLY SPENDING",
    value: 4280,
    change: {
      value: 2.1,
      trend: "up",
      label: "higher than avg",
      color: "#f59e0b",
    },
  },
  {
    label: "TOTAL SAVINGS",
    value: 245000,
    status: { text: "On track for Q4 goal", variant: "success" },
  },
];

export type AIStrategy = {
  badge: string;
  headline: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
};

export const aiStrategy: AIStrategy = {
  badge: "PRO STRATEGY INSIGHT",
  headline: "Optimizing your portfolio for the upcoming Q3 market shift.",
  body: "Our AI analyzed your current allocation and identified 3 key rebalancing opportunities to increase yield by 2.4%.",
  primaryCta: "Execute Strategy",
  secondaryCta: "Review Audit",
};

export type AlertType = "error" | "warning" | "info";

export type AlertItem = {
  id: string;
  type: AlertType;
  title: string;
  body: string;
};

export const activeAlerts: AlertItem[] = [
  {
    id: "1",
    type: "error",
    title: "Subscription Spike",
    body: "3 new recurring charges detected from 'Cloud SaaS' in the last 48h.",
  },
  {
    id: "2",
    type: "warning",
    title: "Emergency Fund Cap",
    body: "Your 'Rainy Day' fund has reached its target of $20k. Redirecting flows?",
  },
  {
    id: "3",
    type: "info",
    title: "Dividend Reinvestment",
    body: "AAPL and MSFT paid dividends today. Automatic reinvestment pending.",
  },
];

export type SentimentData = {
  score: number;
  label: string;
  description: string;
};

export const sentimentData: SentimentData = {
  score: 72,
  label: "BULLISH",
  description:
    "Retail investors are showing strong accumulation signals despite macro headwinds.",
};

export type SignalCardData = {
  badge: string;
  heading: string;
  body: string;
  cta: string;
};

export const signalCardData: SignalCardData = {
  badge: "SIGNAL ACTIVE",
  heading: "Optimizing Alpha: Your Tech-Weighted Strategy",
  body: "We've identified a 4.2% efficiency gap in your fixed-income rotation. Realigning toward sovereign bonds could mitigate the current volatility in your growth bucket.",
  cta: "Review Strategy",
};

// Budget data
export type BudgetCategory = {
  id: string;
  name: string;
  icon:
    | "house.fill"
    | "fork.knife"
    | "bag.fill"
    | "car"
    | "creditcard.fill"
    | "bolt.fill";
  spent: number;
  limit: number;
  percent: number;
  status: "healthy" | "warning" | "critical" | "fixed";
};

export const budgetCategories: BudgetCategory[] = [
  {
    id: "1",
    name: "Housing & Rent",
    icon: "house.fill",
    spent: 3200,
    limit: 3200,
    percent: 100,
    status: "fixed",
  },
  {
    id: "2",
    name: "Groceries",
    icon: "fork.knife",
    spent: 642.5,
    limit: 900,
    percent: 71,
    status: "healthy",
  },
  {
    id: "3",
    name: "Entertainment",
    icon: "bag.fill",
    spent: 450,
    limit: 500,
    percent: 90,
    status: "critical",
  },
  {
    id: "4",
    name: "Transport",
    icon: "car",
    spent: 280,
    limit: 400,
    percent: 70,
    status: "warning",
  },
];

export const budgetVelocity = {
  spent: 12450,
  limit: 15000,
  percent: 83,
  daysRemaining: 12,
};

export const budgetStats = {
  projectedSurplus: 2550,
  savingsEfficiency: 94.2,
};

export type BudgetStrategyData = {
  heading: string;
  highlightedAmount: string;
  body: string;
};

export const budgetStrategy: BudgetStrategyData = {
  heading: "Optimize your spending to save $200.00 next month.",
  highlightedAmount: "₹1500",
  body: "Based on your recent cab usage patterns, switching to ride-pooling options and avoiding peak-hour bookings could reduce your daily commute costs by 18%.",
};

export type BudgetAlertItem = {
  id: string;
  type: "error" | "warning" | "info";
  title: string;
  description: string;
  timestamp: string;
};

export const budgetAlerts: BudgetAlertItem[] = [
  {
    id: "1",
    type: "error",
    title: "Entertainment Threshold",
    description: "Limit is at 90% ($450/$500). Pause non-essential bookings.",
    timestamp: "2 HOURS AGO",
  },
  {
    id: "2",
    type: "warning",
    title: "Dining Anomaly",
    description: "Spending at 'The Oak Room' is 20% higher than your average.",
    timestamp: "YESTERDAY",
  },
  {
    id: "3",
    type: "info",
    title: "Subscription Renewed",
    description:
      "'Bloomberg Terminal' subscription was successfully auto-paid.",
    timestamp: "2 DAYS AGO",
  },
];

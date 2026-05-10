export type SearchItem = {
  label: string;
  page: string;
  sectionId: string;
  pageLabel: string;
};

export const SEARCH_INDEX: SearchItem[] = [
  { label: "Total Net Worth", page: "/", sectionId: "summary-row", pageLabel: "Dashboard" },
  { label: "Monthly Spends", page: "/", sectionId: "summary-row", pageLabel: "Dashboard" },
  { label: "TOTAL SAVINGS", page: "/", sectionId: "summary-row", pageLabel: "Dashboard" },
  { label: "Strategy", page: "/insights", sectionId: "active-signal", pageLabel: "Insights" },
  { label: "Sentiment Index", page: "/insights", sectionId: "sentiment-widget", pageLabel: "Insights" },
  { label: "Portfolio Velocity", page: "/insights", sectionId: "portfolio-velocity", pageLabel: "Insights" },
  { label: "Top Sectors", page: "/insights", sectionId: "portfolio-sectors", pageLabel: "Insights" },
  { label: "Real Estate", page: "/insights", sectionId: "real-estate", pageLabel: "Insights" },
  { label: "Spending Intelligence", page: "/insights", sectionId: "spending-intelligence", pageLabel: "Insights" },
  { label: "Total Budget Velocity", page: "/budgets", sectionId: "budget-velocity", pageLabel: "Budgets" },
  { label: "Projected Surplus", page: "/budgets", sectionId: "budget-highlights", pageLabel: "Budgets" },
  { label: "Savings Efficiency", page: "/budgets", sectionId: "budget-highlights", pageLabel: "Budgets" },
  { label: "Category Allocation", page: "/budgets", sectionId: "category-allocation", pageLabel: "Budgets" },
  { label: "Budget Strategy", page: "/budgets", sectionId: "budget-strategy", pageLabel: "Budgets" },
  { label: "Recent Alerts", page: "/budgets", sectionId: "budget-alerts", pageLabel: "Budgets" },
];

export function filterSearchItems(query: string): SearchItem[] {
  if (!query.trim()) return [];
  const lower = query.toLowerCase();
  return SEARCH_INDEX.filter((item) => item.label.toLowerCase().includes(lower));
}
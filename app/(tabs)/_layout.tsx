import { Platform, useWindowDimensions, View } from "react-native";
import { Slot, usePathname } from "expo-router";
import React, { useEffect } from "react";

import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { ThemedView } from "@/components/themed-view";
import { useAnalytics } from "@/hooks/use-analytics";

const IS_WEB = Platform.OS === "web";

function PageTracker() {
  const pathname = usePathname();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "Dashboard",
      "/insights": "Insights",
      "/budgets": "Budgets",
    };
    const title = titles[pathname] ?? pathname;
    trackPageView(pathname, title);
  }, [pathname, trackPageView]);

  return null;
}

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const showSidebar = IS_WEB && width >= 768;

  return (
    <View style={styles.root} role="document">
      {showSidebar && <Sidebar />}
      <ThemedView style={styles.mainArea} role="main" aria-label="Main content">
        <PageTracker />
        {showSidebar && <TopNavbar />}
        <Slot />
      </ThemedView>
    </View>
  );
}

const styles = {
  root: {
    flex: 1,
    flexDirection: "row" as const,
  },
  mainArea: {
    flex: 1,
    paddingHorizontal: 24,
    zIndex: 1,
  },
};
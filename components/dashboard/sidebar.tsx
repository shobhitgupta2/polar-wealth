import { Link, usePathname } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AccessiblePressable } from "@/components/ui/accessible-pressable";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";

const navItems = [
  { label: "Dashboard", href: "/", icon: "house.fill" as const },
  { label: "Insights", href: "/insights", icon: "chart.bar.fill" as const },
  {
    label: "Market",
    href: "#",
    icon: "chart.line.uptrend.xyaxis" as const,
  },
  {
    label: "Budgets",
    href: "/budgets",
    icon: "dollarsign.square.fill" as const,
  },
  {
    label: "Transactions",
    href: "#",
    icon: "list.bullet" as const,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <ThemedView
      darkColor="#1A1C1D"
      lightColor={Colors.light.background}
      style={styles.sidebar}
      role="complementary"
      aria-label="Sidebar"
    >
      {/* Top content */}
      <Pressable>
        <View style={styles.brandArea}>
          <View style={styles.logoBox}>
            <IconSymbol
              name="chart.line.uptrend.xyaxis"
              size={20}
              color="#ffffff"
              accessibilityLabel="Polar Finance logo"
            />
          </View>
          <View>
            <Pressable>
              <ThemedText style={styles.brandName}>Polar Finance</ThemedText>
              <ThemedText style={styles.brandSubtitle}>
                WEALTH CURATOR
              </ThemedText>
            </Pressable>
          </View>
        </View>
        <View
          style={styles.navList}
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href === "/" && pathname === "/");
            return (
              <Link
                key={item.href}
                href={item.href as any}
                style={styles.navLink}
                aria-current={isActive ? "page" : undefined}
              >
                <View
                  style={[styles.navItem, isActive && styles.navItemActive]}
                >
                  <IconSymbol
                    name={item.icon}
                    size={18}
                    color={isActive ? Colors.dark.text : Colors.dark.icon}
                    accessibilityLabel={item.label}
                  />
                  <ThemedText
                    style={[styles.navLabel, isActive && styles.navLabelActive]}
                  >
                    {item.label}
                  </ThemedText>
                </View>
              </Link>
            );
          })}
        </View>
      </Pressable>

      {/* Bottom section pinned to bottom */}
      <View style={styles.bottomSection} role="contentinfo">
        <View style={styles.proCard}>
          <ThemedText style={styles.proAccessLabel}>PRO ACCESS</ThemedText>
          <ThemedText style={styles.proTitle}>
            Unlock AI Strategy Insights
          </ThemedText>
          <AccessiblePressable
            style={styles.upgradeButton}
            accessibilityLabel="Upgrade to Premium"
            onPress={() => console.log("Upgrade to Premium")}
          >
            <ThemedText style={styles.upgradeButtonText}>
              Upgrade to Premium
            </ThemedText>
          </AccessiblePressable>
        </View>

        <AccessiblePressable
          style={styles.bottomNavItem}
          accessibilityLabel="Help Center"
          onPress={() => console.log("Help Center")}
        >
          <IconSymbol
            name="questionmark.circle.fill"
            size={18}
            color={Colors.dark.icon}
          />
          <ThemedText style={styles.bottomNavLabel}>Help Center</ThemedText>
        </AccessiblePressable>

        <AccessiblePressable
          style={styles.bottomNavItem}
          accessibilityLabel="Logout"
          onPress={() => console.log("Logout")}
        >
          <IconSymbol
            name="rectangle.portrait.and.arrow.right"
            size={18}
            color="#E57373"
            accessibilityLabel="Logout"
          />
          <ThemedText style={[styles.bottomNavLabel, styles.logoutLabel]}>
            Logout
          </ThemedText>
        </AccessiblePressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 320,
    paddingTop: 24,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: "#2d323b",
    justifyContent: "space-between", // ← only addition to sidebar style
  },
  brandArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 32,
  },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 22,
  },
  brandSubtitle: {
    color: Colors.dark.icon,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.5,
    lineHeight: 14,
  },
  navList: {
    gap: 4,
  },
  navLink: {
    textDecorationLine: "none",
    display: "flex",
    width: "100%",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 4,
    flexGrow: 1,
  },
  navItemActive: {
    backgroundColor: Colors.dark.surfaceContainer,
  },
  navLabel: {
    color: Colors.dark.icon,
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 18,
    flexGrow: 1,
  },
  navLabelActive: {
    color: Colors.dark.text,
  },

  // New styles only
  bottomSection: {
    gap: 4,
    paddingBottom: 24,
  },
  proCard: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 6,
  },
  proAccessLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  proTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
    marginBottom: 4,
  },
  upgradeButton: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  upgradeButtonText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  bottomNavItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 4,
  },
  bottomNavLabel: {
    color: Colors.dark.icon,
    fontSize: 16,
    fontWeight: "500",
  },
  logoutLabel: {
    color: "#E57373",
  },
});

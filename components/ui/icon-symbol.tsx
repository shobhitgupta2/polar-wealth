// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<
  SymbolViewProps["name"],
  ComponentProps<typeof MaterialIcons>["name"]
>;
export type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chart.bar.fill": "bar-chart",
  "chart.line.uptrend.xyaxis": "trending-up",
  "dollarsign.square.fill": "attach-money",
  "list.bullet": "format-list-bulleted",
  magnifyingglass: "search",
  "bell.fill": "notifications",
  "gearshape.fill": "settings",
  "exclamationmark.triangle.fill": "warning",
  "checkmark.circle.fill": "check-circle",
  "chart.bar.doc.horizontal": "assessment",
  "arrow.up.right": "trending-up",
  "person.circle.fill": "account-circle",
  "questionmark.circle.fill": "help",
  "rectangle.portrait.and.arrow.right": "logout",
  "bolt.fill": "bolt",
  cpu: "memory",
  "leaf.fill": "energy-savings-leaf",
  "fork.knife": "dining",
  brain: "psychology",
  "bag.fill": "shopping-bag",
  car: "directions-car",
  "creditcard.fill": "credit-card",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  accessibilityLabel,
  accessibilityRole,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
  accessibilityLabel?: string;
  accessibilityRole?: "button" | "link" | "image" | "none";
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
    />
  );
}

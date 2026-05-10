import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";

type AccessiblePressableProps = Omit<PressableProps, "style"> & {
  style?: StyleProp<ViewStyle>;
};

export function AccessiblePressable({ style, ...props }: AccessiblePressableProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={style}
      {...props}
    />
  );
}
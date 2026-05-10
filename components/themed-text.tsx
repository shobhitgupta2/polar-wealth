import { StyleSheet, Text, type TextProps } from 'react-native';

import { Typography } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'displayMD' | 'headlineSM' | 'titleMD' | 'bodyMD' | 'labelSM';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'bodyMD',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text style={[{ color }, styles[type], style]} {...rest} />
  );
}

const styles = StyleSheet.create({
  displayMD: Typography.displayMD,
  headlineSM: Typography.headlineSM,
  titleMD: Typography.titleMD,
  bodyMD: Typography.bodyMD,
  labelSM: Typography.labelSM,
});
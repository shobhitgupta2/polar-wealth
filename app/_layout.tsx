import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from '@expo-google-fonts/dm-serif-display';
import { useFonts as useSoraFonts } from '@expo-google-fonts/sora';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    primary: Colors.dark.primary,
    card: Colors.dark.surfaceContainer,
    text: Colors.dark.text,
    border: Colors.dark.surfaceContainer,
    notification: Colors.dark.error,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'dark';
  const [dmSerifLoaded] = useFonts({});
  const [soraLoaded] = useSoraFonts({});

  const fontsLoaded = dmSerifLoaded && soraLoaded;

  if (fontsLoaded) {
    SplashScreen.hideAsync();
  }

  return (
    <>
      <Head>
        <title>Polar Finance — Wealth Curator</title>
        <meta name="description" content="Personal finance dashboard with AI-driven insights, portfolio analytics, spending breakdowns, and budget intelligence." />
        <meta property="og:title" content="Polar Finance — Wealth Curator" />
        <meta property="og:description" content="Personal finance dashboard with AI-driven insights, portfolio analytics, spending breakdowns, and budget intelligence." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#0f1115" />
      </Head>
    <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </>
  );
}
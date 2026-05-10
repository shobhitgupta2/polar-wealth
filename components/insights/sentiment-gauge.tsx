import { ThemedText } from "@/components/themed-text";
import useFetch from "@/hooks/use-fetch";
import { useEffect } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 160;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Arc spans 270° (from -135° to +135°), leaving a 90° gap at the bottom.
// A score of 0 → full offset (empty arc), 100 → 0 offset (full arc).
function scoreToOffset(score: number): number {
  const clampedScore = Math.min(100, Math.max(0, score));
  const arcFraction = clampedScore / 100;
  // 270/360 = 0.75 of the circumference is the usable arc
  return CIRCUMFERENCE - CIRCUMFERENCE * 0.75 * arcFraction;
}

function scoreToLabel(score: number): string {
  if (score >= 75) return "BULLISH";
  if (score >= 55) return "NEUTRAL";
  if (score >= 35) return "CAUTIOUS";
  return "BEARISH";
}

interface SentimentApiResponse {
  sentiment: number;
}

interface SentimentGaugeProps {
  delay?: number;
}

export function SentimentGauge({ delay = 500 }: SentimentGaugeProps) {
  const { data, isLoading } = useFetch<SentimentApiResponse>(
    "https://shobhit-brightmoney.free.beeceptor.com/sentiment",
  );

  const score = data?.sentiment ?? 0;
  // Start at empty (full offset) and animate to the target
  const progress = useSharedValue(CIRCUMFERENCE);

  useEffect(() => {
    if (!data) return;
    const timeout = setTimeout(() => {
      progress.value = withTiming(scoreToOffset(score), {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);
    return () => clearTimeout(timeout);
  }, [data, score, delay, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: progress.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.gaugeWrapper}>
        {isLoading ? (
          <ActivityIndicator color="#3B82F6" />
        ) : (
          <>
            <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
              {/* Track */}
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke="#1E3A5F"
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={`${CIRCUMFERENCE * 0.75} ${CIRCUMFERENCE * 0.25}`}
                strokeDashoffset={0}
                strokeLinecap="round"
                rotation={-135}
                origin={`${SIZE / 2}, ${SIZE / 2}`}
              />
              {/* Animated fill */}
              <AnimatedCircle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke="#3B82F6"
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={`${CIRCUMFERENCE * 0.75} ${CIRCUMFERENCE * 0.25}`}
                animatedProps={animatedProps}
                strokeLinecap="round"
                rotation={-135}
                origin={`${SIZE / 2}, ${SIZE / 2}`}
              />
            </Svg>
            <View style={styles.centerContent}>
              <ThemedText style={styles.score}>{score}</ThemedText>
              <ThemedText style={styles.label}>
                {scoreToLabel(score)}
              </ThemedText>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeWrapper: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
      },
      web: {
        filter: "drop-shadow(0 0 12px rgba(59, 130, 246, 0.5))",
      },
    }),
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontSize: 56,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 60,
    fontFamily: Platform.OS === "web" ? "'DM Serif Display', serif" : undefined,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    color: "#6B7280",
    marginTop: 2,
  },
});

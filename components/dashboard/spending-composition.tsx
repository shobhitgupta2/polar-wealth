import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import useFetch from "@/hooks/use-fetch";
import Animated, { FadeInDown } from "react-native-reanimated";

interface SpendingApiItem {
  id: number;
  category: string;
  percentage: number;
}

interface SpendingCategory extends SpendingApiItem {
  color: string;
}

interface EditorsNoteApiResponse {
  note: string;
}

const COLOR_BY_ID: Record<number, string> = {
  1: "#818CF8", // Housing & Utilities
  2: "#FB923C", // Dining & Leisure
  3: "#34D399", // Investments
  4: "#94A3B8", // Transportation
};

const TRACK_COLOR = "#2A2D2D";

function CategoryRow({ category, percentage, color }: SpendingCategory) {
  return (
    <View style={styles.categoryRow}>
      <View style={styles.categoryHeader}>
        <ThemedText type="bodyMD" style={styles.categoryLabel}>
          {category}
        </ThemedText>
        <ThemedText type="bodyMD" style={styles.categoryPercent}>
          {percentage}%
        </ThemedText>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%` as any, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

export function SpendingComposition() {
  const { data, isLoading, isError } = useFetch<SpendingApiItem[]>(
    "https://shobhit-brightmoney.free.beeceptor.com/spending-composition",
  );

  const {
    data: editorsNoteData,
    isLoading: isEditorsNoteLoading,
    isError: isEditorsNoteError,
  } = useFetch<EditorsNoteApiResponse>(
    "https://shobhit-brightmoney.proxy.beeceptor.com/editors-note",
  );

  const categories: SpendingCategory[] = (data ?? [])
    .map((item) => ({
      ...item,
      color: COLOR_BY_ID[item.id] ?? "#FFFFFF",
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <ThemedView darkColor="#0C0E0E" style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Spending Composition</ThemedText>
        <Pressable style={styles.viewAll} accessibilityRole="button" accessibilityLabel="View All" onPress={() => console.log("View All")}>
        View All
      </Pressable>
      </View>

      {isLoading && (
        <ActivityIndicator color={Colors.dark.text} style={styles.feedback} />
      )}

      {isError && (
        <ThemedText style={[styles.feedback, styles.errorText]}>
          Failed to load spending data.
        </ThemedText>
      )}

      {!isLoading && !isError && (
        <View style={styles.categories}>
          {categories.map((cat) => (
            <Animated.View key={cat.id} entering={FadeInDown.duration(1200)}>
              <CategoryRow key={cat.id} {...cat} />
            </Animated.View>
          ))}
        </View>
      )}

      <ThemedView darkColor="#1A1D1D" style={styles.editorNote}>
        <ThemedText type="labelSM" style={styles.editorNoteLabel}>
          EDITOR'S NOTE
        </ThemedText>

        {isEditorsNoteLoading && (
          <ActivityIndicator
            color={Colors.dark.text}
            style={styles.editorsNoteFeedback}
          />
        )}

        {isEditorsNoteError && (
          <ThemedText style={[styles.editorsNoteFeedback, styles.errorText]}>
            Failed to load editor's note.
          </ThemedText>
        )}

        {!isEditorsNoteLoading && !isEditorsNoteError && (
          <ThemedText type="bodyMD" style={styles.editorNoteText}>
            {editorsNoteData?.note}
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 24,
    gap: 24,
    minHeight: "auto",
    paddingHorizontal: 36,
    paddingVertical: 40,
    boxShadow: "6px 6px 10px rgba(0, 0, 0, 0.5)",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: Colors.dark.text,
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 32,
  },
  viewAll: {
    color: "lightblue",
    alignSelf: "center",
    fontSize: 18,
    marginBottom: 32,
  },
  categories: {
    gap: 32,
  },
  categoryRow: {
    gap: 12,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryLabel: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  categoryPercent: {
    color: Colors.dark.text,
    fontWeight: "700",
  },
  track: {
    height: 14,
    borderRadius: 6,
    backgroundColor: TRACK_COLOR,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
  editorNote: {
    borderRadius: 12,
    padding: 20,
    gap: 8,
    paddingVertical: 36,
  },
  editorNoteLabel: {
    color: Colors.dark.icon,
    letterSpacing: 1.5,
  },
  editorNoteText: {
    color: Colors.dark.text,
    fontStyle: "italic",
    lineHeight: 22,
    opacity: 0.85,
  },
  feedback: {
    alignSelf: "center",
    marginVertical: 16,
  },
  editorsNoteFeedback: {
    alignSelf: "center",
    marginVertical: 8,
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: 14,
  },
});

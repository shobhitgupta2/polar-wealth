import { useCallback, useEffect, useRef } from "react";
import { LayoutChangeEvent, ScrollView } from "react-native";

interface UseScrollToOptions {
  scrollViewRef: React.RefObject<ScrollView | null>;
  scrollToParam?: string | string[];
  scrollNonce?: string | string[];
}

interface UseScrollToReturn {
  handleLayout: (sectionId: string) => (e: LayoutChangeEvent) => void;
}

export function useScrollTo({
  scrollViewRef,
  scrollToParam,
  scrollNonce,
}: UseScrollToOptions): UseScrollToReturn {
  const sectionOffsets = useRef<Record<string, number>>({});
  const pendingScrollRef = useRef<string | null>(null);

  const target = typeof scrollToParam === "string" ? scrollToParam : null;

  useEffect(() => {
    if (target) {
      pendingScrollRef.current = target;
      const offset = sectionOffsets.current[target];
      const scrollView = scrollViewRef.current;
      if (offset !== undefined && scrollView) {
        scrollView.scrollTo({ y: offset, animated: true });
        pendingScrollRef.current = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, scrollNonce]);

  const handleLayout = useCallback(
    (sectionId: string) => (e: LayoutChangeEvent) => {
      sectionOffsets.current[sectionId] = e.nativeEvent.layout.y;
      if (pendingScrollRef.current === sectionId && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: e.nativeEvent.layout.y, animated: true });
        pendingScrollRef.current = null;
      }
    },
    [scrollViewRef],
  );

  return { handleLayout };
}
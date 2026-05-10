import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { filterSearchItems, type SearchItem } from "@/constants/search";
import { Colors } from "@/constants/theme";
import { useAnalytics } from "@/hooks/use-analytics";
import { useDebounce } from "@/hooks/use-debounce";

const navLinks = [
  { label: "Portfolio", active: true },
  { label: "Analysis", active: false },
  { label: "Market", active: false },
];

export function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<View>(null);
  const inputRef = useRef<TextInput>(null);
  const { trackSearch } = useAnalytics();

  const debouncedQuery = useDebounce(query, 300);
  const results = filterSearchItems(debouncedQuery);

  useEffect(() => {
    if (query.trim()) {
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } else {
      setShowDropdown(false);
      setHighlightedIndex(-1);
    }
  }, [query]);

  const handleSelect = (item: SearchItem) => {
    setQuery("");
    setShowDropdown(false);
    setHighlightedIndex(-1);
    trackSearch(query, item.page);

    const nonce = Date.now().toString();
    if (pathname === item.page) {
      router.setParams({ scrollTo: item.sectionId, scrollNonce: nonce } as any);
    } else {
      router.push({
        pathname: item.page as
          | "/(tabs)"
          | "/(tabs)/budgets"
          | "/(tabs)/insights",
        params: { scrollTo: item.sectionId, scrollNonce: nonce },
      });
    }
  };

  const handleKeyPress = (e: any) => {
    const key = e.nativeEvent.key;
    if (!showDropdown || results.length === 0) return;
    if (key === "ArrowDown") {
      e.preventDefault?.();
      setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (key === "ArrowUp") {
      e.preventDefault?.();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault?.();
      handleSelect(results[highlightedIndex]);
    } else if (key === "Escape") {
      setShowDropdown(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    if (Platform.OS === "web") {
      const handler = (e: MouseEvent) => {
        if (
          dropdownRef.current &&
          !(dropdownRef.current as any).contains(e.target)
        ) {
          setShowDropdown(false);
          setHighlightedIndex(-1);
        }
      };
      document.addEventListener("click", handler);
      return () => document.removeEventListener("click", handler);
    }
  }, []);

  return (
    <ThemedView
      darkColor={Colors.dark.surfaceCard}
      lightColor={Colors.light.surfaceCard}
      style={styles.navbar}
      accessibilityRole="header"
    >
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <IconSymbol
            name="magnifyingglass"
            size={16}
            color={Colors.dark.icon}
            accessibilityLabel="Search"
          />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={setQuery}
            placeholder="Search sections in Polar"
            placeholderTextColor={Colors.dark.icon}
            style={styles.searchInput}
            accessibilityLabel="Search sections"
            accessibilityHint="Type to search for pages and sections"
            onKeyPress={handleKeyPress}
          />
        </View>

        {showDropdown && results.length > 0 && (
          <View
            ref={dropdownRef}
            style={styles.dropdown}
            role="list"
            aria-label="Search suggestions"
          >
            {results.map((item, i) => (
              <Pressable
                key={`${item.page}-${item.sectionId}`}
                accessibilityRole="button"
                accessibilityLabel={`${item.label}, ${item.pageLabel}`}
                style={[
                  styles.dropdownItem,
                  highlightedIndex === i && styles.dropdownItemHighlighted,
                ]}
                onPress={() => handleSelect(item)}
                onPressIn={() => setHighlightedIndex(i)}
              >
                <Text style={styles.dropdownItemLabel}>{item.label}</Text>
                <Text style={styles.dropdownItemPage}>{item.pageLabel}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      <View
        style={styles.centerLinks}
        role="navigation"
        aria-label="Primary navigation"
      >
        {navLinks.map((link) => (
          <View key={link.label} style={styles.navLinkWrapper}>
            <Pressable
              accessibilityRole="link"
              aria-current={link.active ? "page" : undefined}
              style={[styles.navLinkWrapper]}
              onPress={() => console.log(link.label)}
            >
              <ThemedText
                style={[
                  styles.navLinkText,
                  link.active && styles.navLinkActive,
                ]}
              >
                {link.label}
              </ThemedText>
            </Pressable>
            {link.active && <View style={styles.activeUnderline} />}
          </View>
        ))}
      </View>

      <View style={styles.rightActions}>
        <Pressable
          accessibilityLabel="Notifications"
          accessibilityRole="button"
          onPress={() => console.log("Notifications")}
          style={styles.iconButton}
        >
          <IconSymbol name="bell.fill" size={32} color={Colors.dark.icon} />
        </Pressable>
        <ThemedText style={styles.settingsLink}>Settings</ThemedText>
        <Pressable
          accessibilityLabel="User profile"
          accessibilityRole="button"
          onPress={() => console.log("Profile")}
          style={styles.iconButton}
        >
          <IconSymbol
            name="person.circle.fill"
            size={36}
            color={Colors.dark.icon}
          />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 0,
    marginBottom: 20,
    gap: 24,
    borderBottomColor: "#2d323b",
    justifyContent: "space-between",
    zIndex: 10,
  },
  searchWrapper: {
    flex: 1,
    maxWidth: 320,
    position: "relative",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1C1D",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    height: 40,
    gap: 8,
    flex: 1,
  },
  searchInput: {
    color: "#A9ADBB",
    fontSize: 13,
    flex: 1,
    padding: 0,
    height: "100%",
    ...(Platform.OS === "web" && { outlineWidth: 0 }),
  },
  dropdown: {
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: "#1A1C1D",
    borderRadius: 4,
    zIndex: 1000,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2d323b",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownItemHighlighted: {
    backgroundColor: "rgba(59, 130, 246, 0.15)",
  },
  dropdownItemLabel: {
    color: "#ECEDEE",
    fontSize: 13,
    fontWeight: "500",
  },
  dropdownItemPage: {
    color: Colors.dark.icon,
    fontSize: 11,
    fontWeight: "400",
  },
  centerLinks: {
    flexDirection: "row",
    gap: 32,
  },
  navLinkWrapper: {
    alignItems: "center",
    alignSelf: "flex-start",
  },
  navLinkText: {
    color: Colors.dark.icon,
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 20,
  },
  navLinkActive: {
    color: "#8494b7",
    fontWeight: "600",
  },
  activeUnderline: {
    height: 2,
    alignSelf: "stretch",
    backgroundColor: "#8494b7",
    borderRadius: 1,
    marginTop: 4,
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
  },
  settingsLink: {
    color: Colors.dark.icon,
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 18,
  },
  iconButton: {
    padding: 4,
  },
});

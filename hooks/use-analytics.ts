import { useEffect } from "react";

import { useLocalStorage } from "@/hooks/use-local-storage";

const GA4_MEASUREMENT_ID = process.env.EXPO_PUBLIC_GA4_MEASUREMENT_ID;
const GA4_API_SECRET = process.env.EXPO_PUBLIC_GA4_API_SECRET;

async function sendGA4Event(
  eventName: string,
  params: Record<string, unknown>,
  clientId: string,
): Promise<void> {
  if (!GA4_MEASUREMENT_ID || !GA4_API_SECRET) return;

  try {
    await fetch(
      `https://www.google-analytics.com/mp/Collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`,
      {
        method: "POST",
        body: JSON.stringify({
          client_id: clientId,
          events: [{ name: eventName, params }],
        }),
      },
    );
  } catch {
    // silently fail
  }
}

export interface AnalyticsTrackPageView {
  (path: string, title: string): void;
}

export interface AnalyticsTrackSearch {
  (term: string, targetPage: string): void;
}

export interface AnalyticsTrackCTA {
  (name: string, location: string): void;
}

export interface UseAnalyticsReturn {
  trackPageView: AnalyticsTrackPageView;
  trackSearch: AnalyticsTrackSearch;
  trackCTA: AnalyticsTrackCTA;
}

function generateClientId(): string {
  return (
    Math.random().toString(36).slice(2) + Date.now().toString(36)
  );
}

export function useAnalytics(): UseAnalyticsReturn {
  const { value: clientId, setValue: setClientId } =
    useLocalStorage<string>("ga4_client_id", "");

  useEffect(() => {
    if (!clientId) {
      setClientId(generateClientId());
    }
  }, [clientId, setClientId]);

  const trackPageView: AnalyticsTrackPageView = (path, title) => {
    sendGA4Event("page_view", { page_path: path, page_title: title }, clientId);
  };

  const trackSearch: AnalyticsTrackSearch = (term, targetPage) => {
    sendGA4Event("search", { search_term: term, search_target: targetPage }, clientId);
  };

  const trackCTA: AnalyticsTrackCTA = (name, location) => {
    sendGA4Event("cta_click", { cta_name: name, cta_location: location }, clientId);
  };

  return { trackPageView, trackSearch, trackCTA };
}
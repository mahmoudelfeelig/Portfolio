type AnalyticsProperties = Record<string, string | number | boolean>;

type UmamiTracker = {
  track: (eventName: string, data?: AnalyticsProperties) => void;
};

declare global {
  interface Window {
    umami?: UmamiTracker;
  }
}

export function trackEvent(
  eventName: string,
  properties?: AnalyticsProperties,
) {
  if (typeof window === "undefined") return;
  window.umami?.track(eventName, properties);
}

export function trackProjectOpen(projectId: string, source: string) {
  trackEvent("Project Opened", { project: projectId, source });
}

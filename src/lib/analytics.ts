class AnalyticsService {
  private isProd = process.env.NODE_ENV === "production";

  // Track page views
  trackPageView(page: string) {
    if (!this.isProd) {
      console.log(`📊 Page view: ${page}`);
      return;
    }

    // Implementation depends on your analytics provider
    // e.g., window.gtag('event', 'page_view', { page_path: page });
  }

  // Track events
  track(event: string, properties?: Record<string, any>) {
    if (!this.isProd) {
      console.log(`📊 Event: ${event}`, properties || "");
      return;
    }

    // Implementation depends on your analytics provider
    // e.g., window.gtag('event', event, properties);
  }
}

export const Analytics = new AnalyticsService();

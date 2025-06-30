
import { analytics } from './analyticsService';

interface UserBehavior {
  sessionDuration: number;
  pageViews: number;
  interactions: number;
  conversionEvents: number;
}

interface PerformanceInsights {
  avgLoadTime: number;
  errorRate: number;
  bounceRate: number;
  userEngagement: number;
}

class AdvancedAnalytics {
  private sessionStart: number = Date.now();
  private interactions: number = 0;
  private pageViews: number = 0;
  private errors: number = 0;
  private totalEvents: number = 0;

  trackUserJourney(step: string, metadata?: Record<string, any>) {
    analytics.track('user_journey_step', {
      step,
      sessionDuration: this.getSessionDuration(),
      timestamp: Date.now(),
      ...metadata
    });
  }

  trackConversion(type: string, value?: number) {
    analytics.track('conversion', {
      type,
      value,
      sessionDuration: this.getSessionDuration(),
      timestamp: Date.now()
    });
  }

  trackUserEngagement(element: string, action: string, duration?: number) {
    this.interactions++;
    analytics.track('user_engagement', {
      element,
      action,
      duration,
      totalInteractions: this.interactions,
      sessionDuration: this.getSessionDuration()
    });
  }

  trackFeatureUsage(feature: string, success: boolean, metadata?: Record<string, any>) {
    analytics.track('feature_usage', {
      feature,
      success,
      sessionId: this.getSessionId(),
      ...metadata
    });

    if (!success) {
      this.errors++;
    }
    this.totalEvents++;
  }

  trackBusinessMetrics(metric: string, value: number, category?: string) {
    analytics.track('business_metric', {
      metric,
      value,
      category,
      timestamp: Date.now()
    });
  }

  getUserBehavior(): UserBehavior {
    return {
      sessionDuration: this.getSessionDuration(),
      pageViews: this.pageViews,
      interactions: this.interactions,
      conversionEvents: this.getConversionCount()
    };
  }

  getPerformanceInsights(): PerformanceInsights {
    const actionMetrics = analytics.getActionMetrics();
    
    return {
      avgLoadTime: actionMetrics.averageResponseTime,
      errorRate: this.totalEvents > 0 ? (this.errors / this.totalEvents) * 100 : 0,
      bounceRate: this.interactions === 0 ? 100 : 0,
      userEngagement: this.calculateEngagementScore()
    };
  }

  setupRealTimeTracking() {
    // Track scroll depth
    let maxScroll = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        if (scrollPercent >= 25 && scrollPercent % 25 === 0) {
          this.trackUserEngagement('page', `scroll_${scrollPercent}%`);
        }
      }
    };

    // Track time on page
    const trackTimeOnPage = () => {
      const timeSpent = Date.now() - this.sessionStart;
      analytics.trackPerformance('time_on_page', timeSpent);
    };

    // Track clicks
    const trackClicks = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const elementType = target.tagName.toLowerCase();
      const elementId = target.id || 'no-id';
      const elementClass = target.className || 'no-class';
      
      this.trackUserEngagement('click', elementType, Date.now() - this.sessionStart);
      
      analytics.track('element_interaction', {
        elementType,
        elementId,
        elementClass,
        x: event.clientX,
        y: event.clientY
      });
    };

    // Setup event listeners
    window.addEventListener('scroll', trackScroll, { passive: true });
    window.addEventListener('beforeunload', trackTimeOnPage);
    document.addEventListener('click', trackClicks);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', trackScroll);
      window.removeEventListener('beforeunload', trackTimeOnPage);
      document.removeEventListener('click', trackClicks);
    };
  }

  private getSessionDuration(): number {
    return Date.now() - this.sessionStart;
  }

  private getSessionId(): string {
    return `session_${this.sessionStart}`;
  }

  private getConversionCount(): number {
    // Get conversion events from analytics
    return analytics.getActionMetrics().actionsByType.conversion || 0;
  }

  private calculateEngagementScore(): number {
    const sessionDuration = this.getSessionDuration();
    const avgTimePerInteraction = this.interactions > 0 ? sessionDuration / this.interactions : 0;
    const engagementScore = Math.min(100, (this.interactions * 10) + (avgTimePerInteraction / 1000));
    return Math.round(engagementScore);
  }
}

export const advancedAnalytics = new AdvancedAnalytics();

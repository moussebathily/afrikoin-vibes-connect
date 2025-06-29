interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

interface UserMetrics {
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  newRegistrations: number;
  retentionRate: number;
}

interface ActionMetrics {
  totalActions: number;
  actionsByType: Record<string, number>;
  averageResponseTime: number;
  errorRate: number;
}

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  track(event: string, properties?: Record<string, any>, userId?: string) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      userId,
      properties,
      timestamp: Date.now()
    };

    this.events.push(analyticsEvent);
    
    // Store in localStorage for persistence
    this.saveToStorage();
    
    // Log for debugging
    console.log('Analytics Event:', analyticsEvent);

    // In production, send to analytics service
    this.sendToAnalytics(analyticsEvent);
  }

  trackPageView(page: string, userId?: string) {
    this.track('page_view', { page, url: window.location.href }, userId);
  }

  trackUserAction(action: string, success: boolean, duration?: number, userId?: string) {
    this.track('user_action', { 
      action, 
      success, 
      duration,
      device: this.getDeviceInfo()
    }, userId);
  }

  trackError(error: string, context?: string, userId?: string) {
    this.track('error', { 
      error, 
      context, 
      userAgent: navigator.userAgent,
      url: window.location.href
    }, userId);
  }

  trackPerformance(metric: string, value: number, userId?: string) {
    this.track('performance', { metric, value }, userId);
  }

  getUserMetrics(): UserMetrics {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    const dailyUsers = new Set(
      this.events
        .filter(e => e.timestamp && e.timestamp > oneDayAgo && e.userId)
        .map(e => e.userId)
    ).size;

    const monthlyUsers = new Set(
      this.events
        .filter(e => e.timestamp && e.timestamp > oneMonthAgo && e.userId)
        .map(e => e.userId)
    ).size;

    const newRegistrations = this.events
      .filter(e => e.event === 'user_registered' && e.timestamp && e.timestamp > oneDayAgo)
      .length;

    return {
      dailyActiveUsers: dailyUsers,
      monthlyActiveUsers: monthlyUsers,
      newRegistrations,
      retentionRate: dailyUsers > 0 ? (monthlyUsers / dailyUsers) * 100 : 0
    };
  }

  getActionMetrics(): ActionMetrics {
    const actionEvents = this.events.filter(e => e.event === 'user_action');
    const totalActions = actionEvents.length;
    
    const actionsByType: Record<string, number> = {};
    let totalDuration = 0;
    let errorCount = 0;

    actionEvents.forEach(event => {
      if (event.properties?.action) {
        actionsByType[event.properties.action] = (actionsByType[event.properties.action] || 0) + 1;
      }
      
      if (event.properties?.duration) {
        totalDuration += event.properties.duration;
      }
      
      if (!event.properties?.success) {
        errorCount++;
      }
    });

    return {
      totalActions,
      actionsByType,
      averageResponseTime: totalActions > 0 ? totalDuration / totalActions : 0,
      errorRate: totalActions > 0 ? (errorCount / totalActions) * 100 : 0
    };
  }

  private saveToStorage() {
    try {
      // Keep only last 1000 events
      const recentEvents = this.events.slice(-1000);
      localStorage.setItem('afrikoin_analytics', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to save analytics to storage:', error);
    }
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('afrikoin_analytics');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load analytics from storage:', error);
    }
  }

  private sendToAnalytics(event: AnalyticsEvent) {
    // In production, implement actual analytics service integration
    // Examples: Google Analytics, Mixpanel, Amplitude, etc.
    
    // For now, we'll simulate sending to a service
    if (process.env.NODE_ENV === 'production') {
      // fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // }).catch(console.error);
    }
  }

  private getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      language: navigator.language,
      platform: navigator.platform
    };
  }

  initialize() {
    this.loadFromStorage();
    
    // Track page views automatically
    window.addEventListener('popstate', () => {
      this.trackPageView(window.location.pathname);
    });

    // Track performance metrics
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
        }
      });
    }
  }
}

export const analytics = AnalyticsService.getInstance();

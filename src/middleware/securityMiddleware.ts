import { toast } from '@/hooks/use-toast';
import { useActionStore } from '@/store/actionStore';

export interface SecurityCheck {
  action: string;
  requiresAuth?: boolean;
  requiresVerification?: boolean;
  requiredPermissions?: string[];
  rateLimit?: number;
}

export class SecurityMiddleware {
  private static instance: SecurityMiddleware;
  private rateLimitMap = new Map<string, { count: number; resetTime: number }>();

  static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  async checkSecurity(check: SecurityCheck, userId?: string): Promise<{ allowed: boolean; reason?: string }> {
    const store = useActionStore.getState();
    
    // Check authentication
    if (check.requiresAuth && !store.isAuthenticated) {
      return { allowed: false, reason: 'Authentication required' };
    }

    // Check verification
    if (check.requiresVerification && !store.user?.isVerified) {
      return { allowed: false, reason: 'Account verification required' };
    }

    // Check permissions
    if (check.requiredPermissions) {
      const hasPermission = check.requiredPermissions.every(permission => 
        store.checkPermission(permission)
      );
      if (!hasPermission) {
        return { allowed: false, reason: 'Insufficient permissions' };
      }
    }

    // Check rate limiting
    if (check.rateLimit && userId) {
      const key = `${userId}:${check.action}`;
      const now = Date.now();
      const rateData = this.rateLimitMap.get(key);

      if (rateData) {
        if (now < rateData.resetTime) {
          if (rateData.count >= check.rateLimit) {
            return { allowed: false, reason: 'Rate limit exceeded' };
          }
          rateData.count++;
        } else {
          this.rateLimitMap.set(key, { count: 1, resetTime: now + 60000 }); // 1 minute window
        }
      } else {
        this.rateLimitMap.set(key, { count: 1, resetTime: now + 60000 });
      }
    }

    // Check daily action limits
    if (!store.canPerformAction(check.action)) {
      return { allowed: false, reason: 'Daily limit exceeded' };
    }

    return { allowed: true };
  }

  logSecurityEvent(event: {
    action: string;
    userId?: string;
    success: boolean;
    reason?: string;
    metadata?: Record<string, any>;
  }) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...event
    };

    // In a real app, send to analytics service
    console.log('Security Event:', logEntry);
    
    // Store in localStorage for debugging
    const existingLogs = JSON.parse(localStorage.getItem('afrikoin_security_logs') || '[]');
    existingLogs.push(logEntry);
    
    // Keep only last 100 logs
    if (existingLogs.length > 100) {
      existingLogs.splice(0, existingLogs.length - 100);
    }
    
    localStorage.setItem('afrikoin_security_logs', JSON.stringify(existingLogs));
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }

  validateFileUpload(file: File): { valid: boolean; reason?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm',
      'audio/mp3', 'audio/wav', 'audio/ogg',
      'application/pdf', 'text/plain'
    ];

    if (file.size > maxSize) {
      return { valid: false, reason: 'File too large (max 50MB)' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, reason: 'File type not allowed' };
    }

    return { valid: true };
  }
}

export const security = SecurityMiddleware.getInstance();

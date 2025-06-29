
import { useState } from 'react';
import { useActionStore } from '@/store/actionStore';
import { security, SecurityCheck } from '@/middleware/securityMiddleware';
import { useValidation } from '@/hooks/useValidation';
import { toast } from '@/hooks/use-toast';
import { Language } from '@/types/language';
import { z } from 'zod';

interface ActionConfig<T> {
  actionName: string;
  schema?: z.ZodSchema<T>;
  security?: SecurityCheck;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useActionExecutor = (language: Language = 'fr') => {
  const [isExecuting, setIsExecuting] = useState<Record<string, boolean>>({});
  const { validate } = useValidation(language);
  const { user, incrementActionCount, setLoading } = useActionStore();

  const executeAction = async <T,>(
    config: ActionConfig<T>,
    data: T,
    executor: (validatedData: T) => Promise<any>
  ) => {
    const { actionName, schema, security: securityCheck } = config;
    
    try {
      setIsExecuting(prev => ({ ...prev, [actionName]: true }));
      setLoading(actionName, true);

      // Validate input data
      if (schema) {
        const validation = await validate(schema, data);
        if (!validation.isValid) {
          throw new Error('Validation failed');
        }
        data = validation.data!;
      }

      // Security checks
      if (securityCheck) {
        const securityResult = await security.checkSecurity(securityCheck, user?.id);
        if (!securityResult.allowed) {
          security.logSecurityEvent({
            action: actionName,
            userId: user?.id,
            success: false,
            reason: securityResult.reason
          });
          
          throw new Error(securityResult.reason || 'Action not allowed');
        }
      }

      // Execute the action
      const result = await executor(data);

      // Success handling
      incrementActionCount(actionName);
      
      security.logSecurityEvent({
        action: actionName,
        userId: user?.id,
        success: true,
        metadata: { timestamp: Date.now() }
      });

      if (config.successMessage) {
        toast({
          title: language === 'fr' ? 'Succès' : 'Success',
          description: config.successMessage,
          variant: 'default'
        });
      }

      if (config.onSuccess) {
        config.onSuccess(result);
      }

      return { success: true, data: result };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      security.logSecurityEvent({
        action: actionName,
        userId: user?.id,
        success: false,
        reason: errorMessage
      });

      if (config.errorMessage) {
        toast({
          title: language === 'fr' ? 'Erreur' : 'Error',
          description: config.errorMessage,
          variant: 'destructive'
        });
      }

      if (config.onError) {
        config.onError(errorMessage);
      }

      return { success: false, error: errorMessage };
      
    } finally {
      setIsExecuting(prev => ({ ...prev, [actionName]: false }));
      setLoading(actionName, false);
    }
  };

  return {
    executeAction,
    isExecuting
  };
};

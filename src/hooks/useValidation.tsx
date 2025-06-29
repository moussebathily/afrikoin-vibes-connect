
import { useState } from 'react';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { Language } from '@/types/language';

interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors?: Record<string, string>;
}

interface ValidationMessages {
  fr: Record<string, string>;
  en: Record<string, string>;
}

const errorMessages: ValidationMessages = {
  fr: {
    required: 'Ce champ est requis',
    email: 'Email invalide',
    password: 'Mot de passe trop court (min 8 caractères)',
    phone: 'Numéro de téléphone invalide',
    amount: 'Montant invalide',
    length: 'Longueur invalide'
  },
  en: {
    required: 'This field is required',
    email: 'Invalid email',
    password: 'Password too short (min 8 characters)',
    phone: 'Invalid phone number',
    amount: 'Invalid amount',
    length: 'Invalid length'
  }
};

export const useValidation = (language: Language = 'fr') => {
  const [isValidating, setIsValidating] = useState(false);

  const validate = async <T,>(
    schema: z.ZodSchema<T>,
    data: unknown,
    showToast: boolean = true
  ): Promise<ValidationResult<T>> => {
    setIsValidating(true);
    
    try {
      const validatedData = await schema.parseAsync(data);
      setIsValidating(false);
      
      return {
        isValid: true,
        data: validatedData
      };
    } catch (error) {
      setIsValidating(false);
      
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          errors[path] = err.message;
        });

        if (showToast) {
          toast({
            title: language === 'fr' ? 'Erreur de validation' : 'Validation Error',
            description: Object.values(errors)[0],
            variant: 'destructive'
          });
        }

        return {
          isValid: false,
          errors
        };
      }

      return {
        isValid: false,
        errors: { general: 'Erreur de validation inconnue' }
      };
    }
  };

  const validateField = (
    fieldName: string,
    value: unknown,
    rules: { required?: boolean; minLength?: number; maxLength?: number; pattern?: RegExp }
  ): { isValid: boolean; error?: string } => {
    const messages = errorMessages[language];

    if (rules.required && (!value || value === '')) {
      return { isValid: false, error: messages.required };
    }

    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return { isValid: false, error: `Minimum ${rules.minLength} caractères` };
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        return { isValid: false, error: `Maximum ${rules.maxLength} caractères` };
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        return { isValid: false, error: messages[fieldName] || messages.length };
      }
    }

    return { isValid: true };
  };

  return {
    validate,
    validateField,
    isValidating
  };
};

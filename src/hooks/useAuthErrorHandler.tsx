
import { useToast } from '@/hooks/use-toast';

export function useAuthErrorHandler() {
  const { toast } = useToast();

  const handleAuthError = (error: any, context: string = '') => {
    console.error(`Auth error (${context}):`, error);

    let title = 'Erreur d\'authentification';
    let description = 'Une erreur inattendue s\'est produite.';

    if (error?.message) {
      switch (error.message) {
        case 'Invalid login credentials':
          title = 'Identifiants incorrects';
          description = 'Vérifiez votre email et mot de passe.';
          break;
        case 'Email not confirmed':
          title = 'Email non confirmé';
          description = 'Vérifiez votre boîte mail et confirmez votre email.';
          break;
        case 'User already registered':
          title = 'Compte existant';
          description = 'Un compte existe déjà avec cet email.';
          break;
        case 'Signup not allowed for this instance':
          title = 'Inscription désactivée';
          description = 'Les nouvelles inscriptions sont temporairement désactivées.';
          break;
        case 'Password should be at least 6 characters':
          title = 'Mot de passe trop court';
          description = 'Le mot de passe doit contenir au moins 6 caractères.';
          break;
        case 'Unable to validate email address: invalid format':
          title = 'Email invalide';
          description = 'Veuillez saisir une adresse email valide.';
          break;
        case 'For security purposes, you can only request this once every 60 seconds':
          title = 'Trop de tentatives';
          description = 'Attendez 60 secondes avant de réessayer.';
          break;
        default:
          description = error.message;
      }
    }

    // Network-related errors
    if (error?.name === 'NetworkError' || !navigator.onLine) {
      title = 'Problème de connexion';
      description = 'Vérifiez votre connexion internet et réessayez.';
    }

    toast({
      title,
      description,
      variant: 'destructive',
    });
  };

  return { handleAuthError };
}

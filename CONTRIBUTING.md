# Guide de Contribution AfriKoin

Merci de contribuer à AfriKoin ! Ce guide vous aidera à participer efficacement au développement de notre plateforme sociale africaine.

## 📋 Avant de Commencer

Assurez-vous d'avoir lu :
- [README.md](./README.md) - Vue d'ensemble du projet
- [ONBOARDING.md](./ONBOARDING.md) - Guide pour nouveaux contributeurs
- [ORGANIZATION.md](./ORGANIZATION.md) - Structure organisationnelle

## 🤝 Code de Conduite

AfriKoin adopte le [Contributor Covenant](https://www.contributor-covenant.org/fr/version/2/1/code_of_conduct/). Tous les contributeurs doivent respecter ce code pour maintenir une communauté inclusive et accueillante.

## 🚀 Configuration de Développement

### Prérequis
- **Node.js 18+** ou **Node.js 20+**
- **npm 8+**
- **Git** configuré avec votre nom et email
- **Compte GitHub** avec accès au repository

### Installation Locale
```bash
# Cloner le repository
git clone https://github.com/afrikoin-org/afrikoin.git
cd afrikoin

# Installer les dépendances
npm ci --legacy-peer-deps

# Lancer l'application
npm run dev
```

### Outils Recommandés
- **VS Code** avec extensions: Prettier, ESLint, Tailwind CSS IntelliSense
- **React Developer Tools** (extension navigateur)
- **Thunder Client** ou **Postman** (pour tester les APIs)

## 📝 Types de Contributions

### 🐛 Rapport de Bugs
1. Vérifiez que le bug n'est pas déjà reporté
2. Utilisez le template d'issue GitHub
3. Incluez les étapes de reproduction
4. Ajoutez les logs d'erreur si pertinents
5. Spécifiez votre environnement (OS, navigateur, etc.)

### ✨ Nouvelles Fonctionnalités
1. Ouvrez d'abord une **Discussion GitHub** pour valider l'idée
2. Attendez l'approbation d'un mainteneur avant de développer
3. Suivez les guidelines d'architecture existantes
4. Incluez les tests et la documentation

### 📚 Amélioration Documentation
1. Corrigez les typos et erreurs
2. Ajoutez des exemples manquants
3. Améliorez la clarté des explications
4. Traduisez dans d'autres langues africaines

### 🎨 Améliorations UI/UX
1. Respectez le design system existant
2. Utilisez les composants shadcn/ui existants
3. Assurez-vous de la responsivité mobile
4. Testez l'accessibilité

### 🌍 Traductions
1. Vérifiez `/src/i18n/locales/` pour les langues supportées
2. Suivez le format JSON existant
3. Respectez le contexte culturel
4. Validez avec des locuteurs natifs si possible

## 🔄 Workflow de Contribution

### 1. Préparation
```bash
# Fork du repository sur GitHub (si contributeur externe)
# Cloner votre fork ou le repository principal
git clone https://github.com/VOTRE-USERNAME/afrikoin.git

# Ajouter le remote upstream (si fork)
git remote add upstream https://github.com/afrikoin-org/afrikoin.git

# Créer une branche feature
git checkout -b feature/votre-equipe-description
```

### 2. Développement
```bash
# Faire vos modifications
# Tester localement
npm run dev

# Vérifier la qualité du code
npm run lint
npx tsc --noEmit

# Tester le build
npm run build
```

### 3. Soumission
```bash
# Commiter avec des messages conventionnels
git add .
git commit -m "feat: description de votre changement"

# Pousser la branche
git push origin feature/votre-equipe-description

# Créer la Pull Request sur GitHub
```

## 📏 Standards de Code

### Conventions de Nommage
- **Composants**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase avec préfixe `use` (`useAuthContext.ts`)
- **Utilitaires**: camelCase (`formatCurrency.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **Types**: PascalCase avec suffixe `Type` (`UserProfileType`)

### Structure des Fichiers
```typescript
// 1. Imports externes
import React from 'react';
import { useRouter } from 'react-router-dom';

// 2. Imports internes
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';

// 3. Types
interface ComponentProps {
  title: string;
}

// 4. Composant principal
export const ComponentName: React.FC<ComponentProps> = ({ title }) => {
  // Logic here
  return (
    <div>
      {/* JSX here */}
    </div>
  );
};
```

### Styling Guidelines
- **Utilisez les tokens du design system** dans `index.css`
- **Préférez les composants shadcn/ui** aux styles custom
- **Mobile-first**: Responsive design obligatoire
- **Dark mode**: Supporté via les CSS variables

## ✍️ Messages de Commit

Nous utilisons les [Conventional Commits](https://www.conventionalcommits.org/fr/) pour maintenir un historique Git propre et générer automatiquement les changelogs.

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types Autorisés
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Mise à jour documentation
- `style`: Formatage, style (sans changement logique)
- `refactor`: Refactoring sans changement fonctionnel
- `perf`: Amélioration de performance
- `test`: Ajout ou modification de tests
- `chore`: Maintenance, configuration, build
- `ci`: Changements CI/CD
- `revert`: Annulation d'un commit précédent

### Exemples
```bash
feat(auth): add social login with Google
fix(payment): resolve checkout validation error
docs(readme): update installation instructions
style(button): improve hover animations
refactor(api): simplify user data fetching
test(auth): add unit tests for login component
chore(deps): update dependencies to latest versions
```

### Règles
- **Langue**: Français ou anglais (cohérence dans le projet)
- **Longueur**: Description < 72 caractères
- **Scope**: Optionnel mais recommandé (auth, ui, api, mobile, etc.)
- **Body**: Explique le "pourquoi", pas le "quoi"
- **Footer**: Référence les issues (`Closes #123`)

## 🔍 Processus de Review

### Création de Pull Request
1. **Titre descriptif**: Résume clairement le changement
2. **Description complète**: Utilisez le template GitHub
3. **Assignation**: Sera automatique selon CODEOWNERS
4. **Labels**: Ajoutez les labels appropriés
5. **Draft**: Utilisez les draft PRs pour travail en cours

### Template de PR
```markdown
## Description
Brève description du changement et pourquoi il est nécessaire.

## Type de changement
- [ ] Bug fix (changement non-breaking qui corrige un problème)
- [ ] Nouvelle fonctionnalité (changement non-breaking qui ajoute une fonctionnalité)
- [ ] Breaking change (correction ou fonctionnalité qui casserait la fonctionnalité existante)
- [ ] Mise à jour documentation

## Tests effectués
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Tests manuels effectués
- [ ] Build de production réussit

## Checklist
- [ ] Mon code suit les conventions de style du projet
- [ ] J'ai effectué une auto-review de mon code
- [ ] J'ai commenté mon code dans les parties complexes
- [ ] J'ai fait les changements de documentation correspondants
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que ma correction fonctionne
```

### Critères d'Approbation
- **Code quality**: Linting, type-checking réussis
- **Tests**: Tous les tests passent
- **Reviews**: Minimum 2 approbations (3 pour changements critiques)
- **Documentation**: Mise à jour si nécessaire
- **Performance**: Pas de régression notable

## 🧪 Tests et Qualité

### Exécuter les Tests
```bash
# Linting (obligatoire)
npm run lint

# Correction automatique du linting
npm run lint -- --fix

# Type checking (obligatoire)
npx tsc --noEmit

# Tests unitaires (si disponibles)
npm test

# Tests de build (obligatoire)
npm run build

# Preview du build
npm run preview
```

### Standards de Qualité
- **Linting**: Zéro erreur ESLint
- **Types**: Zéro erreur TypeScript
- **Build**: Build réussi sans warnings critiques
- **Performance**: Lighthouse score > 90 sur mobile
- **Accessibilité**: Conformité WCAG AA minimum

### Tests Recommandés
- **Composants**: Tests de rendu et interactions
- **Hooks**: Tests des états et effets de bord
- **Utilitaires**: Tests unitaires complets
- **API**: Tests d'intégration des edge functions

## 🌍 Internationalisation (i18n)

AfriKoin supporte plusieurs langues africaines. Voici comment contribuer aux traductions :

### Langues Supportées
- **en**: Anglais (référence)
- **fr**: Français
- **ar**: Arabe
- **ha**: Hausa
- **pt**: Portugais
- **sw**: Swahili  
- **yo**: Yoruba

### Ajouter une Traduction
```bash
# Structure des fichiers de traduction
src/i18n/locales/
├── en/common.json     # Référence
├── fr/common.json     # Français
└── [langue]/common.json
```

### Format JSON
```json
{
  "auth": {
    "login": "Se connecter",
    "logout": "Se déconnecter",
    "signup": "S'inscrire"
  },
  "navigation": {
    "home": "Accueil",
    "profile": "Profil",
    "wallet": "Portefeuille"
  }
}
```

### Bonnes Pratiques i18n
- **Clés descriptives**: Utilisez des clés qui décrivent le contexte
- **Pluriels**: Gérez les formes plurielles si nécessaire
- **Variables**: Utilisez des placeholders pour les valeurs dynamiques
- **Contexte culturel**: Adaptez aux spécificités culturelles locales

## 🔒 Sécurité

### Signalement de Vulnérabilités
**NE POSTEZ PAS** les vulnérabilités de sécurité dans les issues publiques.
Contactez l'équipe de sécurité via : security@afrikoin.org

### Guidelines Sécurité
- **Authentification**: Validez toujours côté serveur
- **Données sensibles**: Chiffrez les données personnelles
- **API**: Utilisez HTTPS uniquement
- **Input validation**: Sanitisez toutes les entrées utilisateur
- **Dependencies**: Maintenez les dépendances à jour

## 🚀 Déploiement et Release

### Environnements
- **Development**: Branche `develop` - Auto-déploiement
- **Staging**: Branche `staging` - Tests pré-production
- **Production**: Branche `main` - Release manuelle

### Process de Release
1. **Feature freeze**: Stop des nouvelles features
2. **Testing**: Tests complets en staging
3. **Documentation**: Mise à jour changelog et docs
4. **Release**: Tag et déploiement production
5. **Monitoring**: Surveillance post-déploiement

## 💬 Communication et Support

### Canaux de Communication
- **GitHub Issues**: Bugs et demandes de fonctionnalités
- **GitHub Discussions**: Questions générales et idées
- **Pull Requests**: Reviews de code et discussions techniques
- **Email**: security@afrikoin.org pour les vulnérabilités

### Obtenir de l'Aide
1. **Documentation**: Consultez d'abord README et ONBOARDING
2. **Issues**: Recherchez les issues existantes
3. **Discussions**: Posez vos questions dans GitHub Discussions
4. **Équipe**: Mentionnez @afrikoin-team/core pour l'aide urgente

### Étiquette Communautaire
- **Soyez respectueux** et inclusif
- **Constructif**: Proposez des solutions, pas seulement des problèmes
- **Patient**: Les reviews prennent du temps
- **Collaboratif**: Aidez les autres contributeurs
- **Transparent**: Communiquez ouvertement sur vos travaux

## 🏆 Reconnaissance

### Hall of Fame
Les contributeurs sont reconnus dans :
- **README**: Section contributeurs
- **Release notes**: Mentions dans les changelogs
- **GitHub**: Profils contributor et statistiques
- **Community**: Reconnaissance publique sur nos canaux

### Devenir Mainteneur
Les contributeurs réguliers et de qualité peuvent être invités à devenir mainteneurs avec :
- **Accès étendu**: Permissions sur le repository
- **Responsabilités**: Review de code, mentoring
- **Décisions**: Participation aux décisions techniques
- **Recognition**: Statut officiel dans l'organisation

---

## 🤝 Merci !

Votre contribution, petite ou grande, fait une différence pour AfriKoin et la communauté africaine en ligne. Ensemble, nous construisons une plateforme qui reflète la richesse et la diversité de l'Afrique.

**Asante sana! Merci beaucoup! شكرا جزيلا! Nagode! Obrigado! E se pupo!** 🌍❤️


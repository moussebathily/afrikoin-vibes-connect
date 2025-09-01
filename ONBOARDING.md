# 🚀 Guide d'Onboarding AfriKoin

Bienvenue dans l'équipe AfriKoin ! Ce guide vous aidera à vous intégrer rapidement et efficacement dans notre organisation.

## 📋 Checklist d'Onboarding

### Jour 1 - Configuration Initiale
- [ ] Invitation GitHub reçue et acceptée
- [ ] Assignation à l'équipe appropriée
- [ ] Accès au repository principal configuré
- [ ] Configuration de l'environnement de développement local
- [ ] Premier clone du repository
- [ ] Installation des dépendances réussie
- [ ] Application lancée en local

### Semaine 1 - Familiarisation
- [ ] Lecture complète de la documentation
- [ ] Compréhension de l'architecture du projet
- [ ] Participation à la réunion d'équipe
- [ ] Première contribution (fix mineur ou documentation)
- [ ] Setup des outils de développement
- [ ] Configuration des notifications GitHub

### Mois 1 - Intégration Complète
- [ ] Première feature développée avec review
- [ ] Compréhension des processus CI/CD
- [ ] Participation aux décisions d'équipe
- [ ] Mentoring d'un nouveau membre (si applicable)

## 🛠️ Configuration de l'Environnement

### Prérequis Système
```bash
# Node.js 18+ ou 20+
node --version  # Doit afficher v18.x ou v20.x

# npm moderne
npm --version  # Doit être 8+ 

# Git configuré
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

### Installation du Projet
```bash
# Cloner le repository
git clone https://github.com/afrikoin-org/afrikoin.git
cd afrikoin

# Installer les dépendances
npm ci --legacy-peer-deps

# Lancer l'application en développement
npm run dev
```

### Outils Recommandés

#### IDE/Éditeur
- **VS Code** (recommandé) avec extensions:
  - Prettier
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript Hero
  - Thunder Client (pour tester les APIs)

#### Extensions Navigateur
- **React Developer Tools**
- **Redux DevTools** (si applicable)
- **Lighthouse** (pour l'audit de performance)

#### Outils CLI Utiles
```bash
# Installation d'outils globaux utiles
npm install -g npm-check-updates  # Vérifier les mises à jour
npm install -g serve              # Server statique pour tester les builds
```

## 🏗️ Architecture du Projet

### Structure des Dossiers
```
afrikoin/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── ui/             # Composants UI de base (shadcn/ui)
│   │   ├── ai/             # Composants IA
│   │   ├── layout/         # Composants de mise en page
│   │   └── ...             # Autres composants métier
│   ├── pages/              # Pages de l'application
│   ├── contexts/           # Contextes React (Auth, etc.)
│   ├── hooks/              # Hooks personnalisés
│   ├── i18n/               # Internationalisation
│   ├── integrations/       # Intégrations externes (Supabase)
│   ├── lib/                # Utilitaires et helpers
│   └── types/              # Définitions TypeScript
├── supabase/               # Backend Supabase
│   ├── functions/          # Edge Functions
│   └── migrations/         # Migrations DB
├── android/                # Configuration Android/Capacitor
├── .github/                # CI/CD et templates
└── scripts/                # Scripts de déploiement
```

### Stack Technologique
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Mobile**: Capacitor
- **Deployment**: Vercel (frontend) + Supabase (backend)
- **CI/CD**: GitHub Actions

## 📚 Ressources d'Apprentissage

### Documentation Interne
1. [README.md](./README.md) - Vue d'ensemble du projet
2. [CONTRIBUTING.md](./CONTRIBUTING.md) - Guide de contribution
3. [ORGANIZATION.md](./ORGANIZATION.md) - Structure organisationnelle
4. `/docs/*` - Documentation technique détaillée

### Documentation Externe
- [React 18 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)

### Formations Recommandées
- **React/TypeScript**: Si nouveau sur ces technologies
- **Supabase**: Comprendre notre backend
- **Mobile Development**: Pour l'équipe mobile
- **AI/ML**: Pour l'équipe IA

## 🤝 Processus de Travail

### Workflow Git
```bash
# 1. Créer une branche feature
git checkout -b feature/your-team-feature-name

# 2. Développer et commiter
git add .
git commit -m "feat: description of your change"

# 3. Pousser et créer une PR
git push origin feature/your-team-feature-name
# Puis créer la PR sur GitHub
```

### Conventions de Commits
Nous utilisons les [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Mise à jour documentation
- `style:` Formatage, style (pas de changement de logique)
- `refactor:` Refactoring sans changement de fonctionnalité
- `test:` Ajout ou modification de tests
- `chore:` Maintenance, configuration

### Code Review
1. **Créer une PR** avec description détaillée
2. **Assignation automatique** selon CODEOWNERS
3. **Attendre les reviews** (minimum 2 approbations)
4. **Répondre aux commentaires** et ajuster si nécessaire
5. **Merge** après approbation

## 🎯 Première Contribution

### Suggestions pour Débuter
1. **Documentation**: Corriger une typo ou améliorer un README
2. **Bug Fix**: Prendre un issue marqué `good first issue`
3. **Tests**: Ajouter des tests manquants
4. **Traduction**: Ajouter/corriger des traductions i18n
5. **UI Enhancement**: Améliorer un composant existant

### Issues Recommandées
Cherchez les labels suivants sur GitHub:
- `good first issue` - Parfait pour débuter
- `help wanted` - L'équipe cherche de l'aide
- `documentation` - Améliorations de docs
- `enhancement` - Nouvelles fonctionnalités

## 🧪 Tests et Qualité

### Lancer les Tests
```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Tests unitaires (si configurés)
npm test

# Build de production
npm run build
```

### Standards de Qualité
- **Linting**: ESLint configuration stricte
- **Formatting**: Prettier automatique
- **Types**: TypeScript strict mode
- **Coverage**: Visez 80% minimum pour les nouvelles fonctions
- **Performance**: Bundle size et Core Web Vitals

## 👥 Communication et Collaboration

### Canaux de Communication
- **GitHub Issues**: Bugs, features, discussions techniques
- **GitHub Discussions**: Questions générales, idées
- **Pull Requests**: Code reviews et discussions techniques
- **GitHub Projects**: Suivi des tâches et roadmap

### Réunions d'Équipe
- **Daily Standups**: Selon l'équipe
- **Sprint Planning**: Bi-hebdomadaire
- **Tech Reviews**: Mensuel
- **All-Hands**: Trimestriel

### Étiquette et Bonnes Pratiques
- **Soyez respectueux** dans toutes les interactions
- **Posez des questions** si quelque chose n'est pas clair
- **Documentez vos décisions** techniques importantes
- **Aidez les autres** membres de l'équipe
- **Partagez vos connaissances** régulièrement

## 🆘 Support et Aide

### Qui Contacter
- **Questions générales**: Créer une GitHub Discussion
- **Problèmes techniques**: Votre équipe directe ou mentor
- **Urgences**: @afrikoin-team/core
- **RH/Admin**: Responsable d'équipe

### Resources d'Aide
- **Documentation**: Ce repository
- **Stack Overflow**: Pour questions techniques générales
- **Discord communauté**: Liens dans README principal

## ✅ Validation d'Onboarding

### Auto-Évaluation Semaine 1
- [ ] Je peux lancer l'application localement sans erreur
- [ ] Je comprends la structure du projet
- [ ] J'ai fait ma première contribution (même mineure)
- [ ] Je connais le processus de PR et code review
- [ ] Je sais où trouver de l'aide

### Feedback avec le Mentor
Planifiez une session de 30 minutes avec votre mentor pour:
- Valider votre compréhension
- Identifier les points d'amélioration
- Définir vos prochains objectifs
- Répondre aux questions restantes

## 🚀 Prochaines Étapes

Félicitations ! Vous êtes maintenant prêt à contribuer efficacement à AfriKoin. 

### Objectifs Court Terme (1 mois)
1. Maîtriser votre stack d'équipe
2. Contribuer régulièrement avec des PR de qualité
3. Participer activement aux code reviews
4. Proposer des améliorations

### Objectifs Long Terme (3-6 mois)
1. Devenir référent sur certains composants
2. Mentorer de nouveaux arrivants
3. Contribuer à l'architecture et aux décisions techniques
4. Représenter l'équipe dans les discussions produit

---

**Bienvenue dans l'aventure AfriKoin ! 🎉**

N'hésitez pas à poser des questions et à contribuer à améliorer ce guide d'onboarding pour les futurs membres de l'équipe.